import { Node, NodeDef } from "../../node";
import { Process, Status } from "../../process";
import { TreeEnv } from "../../tree-env";

interface NodeArgs {
    readonly value: string;
}

export class Calculate extends Process {
    override init(node: Node): void {
        const args = node.args as unknown as NodeArgs;
        if (typeof args.value !== "string" || args.value.length === 0) {
            node.error(`args.value is not a expr string`);
        }
        node.tree.context.compileCode(args.value);
    }

    override run(node: Node, env: TreeEnv): Status {
        const args = node.args as unknown as NodeArgs;
        try {
            const value = env.eval(args.value);
            env.output.push(value);
            return "success";
        } catch (e) {
            console.error(e);
            return "failure";
        }
    }

    override get descriptor(): NodeDef {
        return {
            name: "Calculate",
            type: "Action",
            desc: "简单的数值公式计算",
            args: [{ name: "value", type: "code", desc: "值" }],
            output: ["计算结果"],
            doc: `
                + 做简单的数值公式计算，返回结果到输出`,
        };
    }
}
