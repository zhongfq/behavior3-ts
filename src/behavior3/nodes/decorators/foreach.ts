import { Node } from "../../node";
import { Process, Status } from "../../process";
import { TreeEnv } from "../../tree-env";

type NodeInput = [unknown[]];
type NodeOutput = [string];

export class Foreach extends Process {
    constructor() {
        super({
            name: "ForEach",
            type: "Decorator",
            children: 1,
            status: ["success", "|running", "|failure"],
            desc: "遍历数组",
            input: ["数组"],
            output: ["变量"],
            doc: `
                + 只能有一个子节点，多个仅执行第一个
                + 遍历输入数组，将当前元素写入\`变量\`
                + 当子节点返回 \`failure\` 时，退出遍历并返回 \`failure\` 状态
                + 执行完所有子节点后，返回 \`success\``,
        });
    }

    override tick(node: Node, env: TreeEnv): Status {
        const [arr] = env.input as NodeInput;
        const [varname] = node.output as NodeOutput;
        let i: number | undefined = node.resume(env);
        if (i !== undefined) {
            if (env.status === "running") {
                node.error(`unexpected status error`);
            } else if (env.status === "failure") {
                return "failure";
            }
            i++;
        } else {
            i = 0;
        }

        for (; i < arr.length; i++) {
            env.set(varname, arr[i]);
            const status = node.children[0].tick(env);
            if (status === "running") {
                return node.yield(env, i);
            } else if (status === "failure") {
                return "failure";
            }
        }

        return "success";
    }
}
