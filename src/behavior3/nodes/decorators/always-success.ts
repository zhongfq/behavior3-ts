import { Node } from "../../node";
import { Process, Status } from "../../process";
import { TreeEnv } from "../../tree-env";

export class AlwaysSuccess extends Process {
    constructor() {
        super({
            name: "AlwaysSuccess",
            type: "Decorator",
            children: 1,
            status: ["success", "|running"],
            desc: "始终返回成功",
            doc: `
                + 只能有一个子节点，多个仅执行第一个
                + 不管子节点是否成功都返回 \`success\`
            `,
        });
    }

    override tick(node: Node, env: TreeEnv): Status {
        const isYield: boolean | undefined = node.resume(env);
        if (typeof isYield === "boolean") {
            if (env.status === "running") {
                node.error(`unexpected status error`);
            }
            return "success";
        }
        const status = node.children[0].tick(env);
        if (status === "running") {
            return node.yield(env);
        }
        return "success";
    }
}
