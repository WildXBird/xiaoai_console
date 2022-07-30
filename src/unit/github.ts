import { GithubAPIKEY } from "../config/key"
import { Notification } from '../unit/type';
//@ts-ignore
import { FriendlyTime } from 'friendly-time';

type GithubNotification = {
    id: string
    unread: boolean
    reason: "mention" | string
    updated_at: string,
    subject: {
        title: string
        url: string
        latest_comment_url: string
        type: "Issue" | string
    },
    repository: {
        name: string
        full_name: string
        url: string
        private: boolean
    }
}

// https://github.com/bootdev/az_lungcancer_frontend/issues/266?notification_referrer_id=NT_kwDOAfQB3LMyNjcxMTU2MDgxOjMyNzY4NDc2#issuecomment-968458428
export async function GetGithubNotifications(): Promise<Notification[]> {
    const API_KEY: string = GithubAPIKEY()
    const response = await fetch(`https://api.github.com/notifications?page=1&per_page=100&tts=${new Date().valueOf()}`, {
        // const response = await fetch(`https://api.github.com/repos/bootdev/az_lungcancer_frontend/issues/comments/968579060`, {
        method: 'GET', headers: {
            "Content-Type": "application/json",
            Authorization: `token ${API_KEY}`
        }
    })
    const data: GithubNotification[] = await response.json();
    console.log("data", data)

    const result: Notification[] = []

    for (let item of data) {
        let action = "?"
        switch (item.reason) {
            case "mention":
                action = "有人提到了你"
                break;
            case "ci_activity":
                action = "CI触发了事件"
                break;
            case "author":
                action = "有人请示你"
                break;
            case "state_change":
                action = "状态改变了"
                break;
            case "assign":
                action = "给你分配了任务"
                break;


            default:
                action = item.reason
                break;
        }

        let type = "?"
        switch (item.subject.type) {
            case "CheckSuite":
                type = "Checks"
                break;
            case "Issue":
                type = "议题"
                break;
            case "PullRequest":
                type = "合并请求"
                break;
            default:
                type = item.subject.type
                break;
        }


        let subURL = item.subject.url || item.repository.url || "https://github.com/notifications?query=is%3Aunread"
        if (item.reason === "ci_activity") {
            subURL = `${item.repository.url}/actions`
        }


        result.push({
            id: `gh-${item.id}(${item.updated_at}/${item.reason}/${item.subject.url}/)`,
            brief: `${item.subject.title}`,
            title: `${action}`,
            summary: `在${item.repository.private ? "私有仓库" : "公开仓库"} ${item.repository.name} 中的 ${item.subject.title}(${type}) 里${action}`,
            time: new Date(item.updated_at),
            url: new URL(subURL.replace("api.", "").replace("/repos/", "/")),
            picture: new URL("https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
        })
    }

    // 


    return result
}

