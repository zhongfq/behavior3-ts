import { Node } from "../../node";
import { Process, Status } from "../../process";
import { TreeEnv } from "../../tree-env";

interface NodeArgs {
    readonly value: string;
}

export class Check extends Process {
    constructor() {
        super({
            name: "Check",
            type: "Condition",
            children: 0,
            status: ["success", "failure"],
            desc: "检查True或False",
            args: [{ name: "value", type: "expr", desc: "值" }],
            doc: `
                + 做简单数值公式判定，返回 \`success\` 或 \`failure\`
            `,
        });
    }

    override init(node: Node) {
        const args = node.args as unknown as NodeArgs;
        if (typeof args.value !== "string" || args.value.length === 0) {
            node.error(`args.value is not a expr string`);
        }
        node.tree.context.compileCode(args.value);
    }

    override tick(node: Node, env: TreeEnv): Status {
        const args = node.args as unknown as NodeArgs;
        const value = env.eval(args.value);
        return value ? "success" : "failure";
    }
}
