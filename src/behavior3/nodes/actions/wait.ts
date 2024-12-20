import { Node } from "../../node";
import { Process, Status } from "../../process";
import { TreeEnv } from "../../tree-env";

interface NodeArgs {
    readonly time: number;
    readonly random?: number;
}

export class Wait extends Process {
    constructor() {
        super({
            name: "Wait",
            type: "Action",
            children: 0,
            status: ["success", "running"],
            desc: "等待",
            input: ["等待时间?"],
            args: [
                {
                    name: "time",
                    type: "float?",
                    desc: "等待时间",
                    oneof: "等待时间",
                },
                {
                    name: "random",
                    type: "float?",
                    desc: "随机范围",
                },
            ],
        });
    }

    override tick(node: Node, env: TreeEnv): Status {
        const t: number | undefined = node.resume(env);
        if (typeof t === "number") {
            if (env.context.time >= t) {
                return "success";
            } else {
                return "running";
            }
        } else {
            const args = node.args as unknown as NodeArgs;
            let time = this._checkOneof(node, env, 0, args.time, 0);
            if (args.random) {
                time += (Math.random() - 0.5) * args.random;
            }
            return node.yield(env, env.context.time + time);
        }
    }
}
