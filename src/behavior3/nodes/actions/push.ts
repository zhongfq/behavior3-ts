import { Node } from "../../node";
import { Process, Status } from "../../process";
import { TreeEnv } from "../../tree-env";

type NodeInput = [unknown[], unknown];

export class Push extends Process {
    constructor() {
        super({
            name: "Push",
            type: "Action",
            children: 0,
            status: ["success", "failure"],
            desc: "向数组中添加元素",
            input: ["数组", "元素"],
            doc: `
                + 当变量\`数组\`不是数组类型时返回 \`failure\`
                + 其余返回 \`success\`
            `,
        });
    }

    override tick(node: Node, env: TreeEnv): Status {
        const [arr, element] = env.input as NodeInput;
        if (!Array.isArray(arr)) {
            return "failure";
        }
        arr.push(element);
        return "success";
    }
}
