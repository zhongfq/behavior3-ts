import { Node } from "../../node";
import { Process, Status } from "../../process";
import { TreeEnv } from "../../tree-env";

type Input = [unknown[]];

export class Filter extends Process {
    constructor() {
        super({
            name: "Filter",
            type: "Decorator",
            children: 1,
            status: ["success", "failure", "|running"],
            desc: "返回满足条件的元素",
            input: ["输入数组"],
            output: ["变量", "新数组"],
            doc: `
                + 只能有一个子节点，多个仅执行第一个
                + 遍历输入数组，将当前元素写入\`变量\`，满足条件的元素放入新数组
                + 只有当新数组不为空时，才返回 \`success\`
            `,
        });
    }

    override tick(node: Node, env: TreeEnv): Status {
        const [arr] = env.input as Input;
        if (!(arr instanceof Array) || arr.length === 0) {
            return "failure";
        }

        let last: [number, unknown[]] | undefined = node.resume(env);
        let i;
        let newArr: unknown[];
        if (last instanceof Array) {
            [i, newArr] = last;
            if (env.status === "running") {
                node.error(`unexpected status error`);
            } else if (env.status === "success") {
                newArr.push(arr[i]);
            }
            i++;
        } else {
            i = 0;
            newArr = [];
        }

        const filter = node.children[0];

        for (i = 0; i < arr.length; i++) {
            env.set(node.output[0], arr[i]);
            const status = filter.tick(env);
            if (status === "running") {
                if (last instanceof Array) {
                    last[0] = i;
                    last[1] = newArr;
                } else {
                    last = [i, newArr];
                }
                return node.yield(env, last);
            } else if (status === "success") {
                newArr.push(arr[i]);
            }
        }

        env.output.push(undefined, newArr);

        return newArr.length === 0 ? "failure" : "success";
    }
}
