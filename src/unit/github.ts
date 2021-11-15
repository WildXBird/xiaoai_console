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
        private: boolean
    }
}

// https://github.com/bootdev/az_lungcancer_frontend/issues/266?notification_referrer_id=NT_kwDOAfQB3LMyNjcxMTU2MDgxOjMyNzY4NDc2#issuecomment-968458428
export async function GetGithubNotifications(): Promise<Notification[]> {
    const API_KEY: string = GithubAPIKEY()
    const response = await fetch(`https://api.github.com/notifications?page=1&per_page=100`, {
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
                action = "提到了你"
                break;
            default:
                action = item.reason
                break;
        }
        result.push({
            id: `gh-${item.id}(${item.updated_at})`,
            brief: `${item.subject.title}`,
            title: `有人在 ${item.subject.type} ${action}`,
            summary: `在${item.repository.private ? "私有仓库" : "公开仓库"} ${item.repository.name} 中的 ${item.subject.title}${item.subject.type} 里有人${action}`,
            time: new Date(item.updated_at),
            url: new URL(item.subject.url.replace("api.","").replace("/repos/","/")),
            picture: new URL("https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
        })
    }

    // 


    return result
}

