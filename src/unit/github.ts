import { GithubAPIKEY } from "../config/key"
import { Notification } from '../unit/type';


export async function GetGithubNotifications(): Promise<Notification[]> {
    const API_KEY: string = GithubAPIKEY()
    const response = await fetch(`https://api.github.com/notifications?page=1&per_page=100`, {
        method: 'GET', headers: {
            "Content-Type": "application/json",
            Authorization: `token ${API_KEY}`
        }
    })
    const data = await response.json();
console.log("data",data)
    return []
}

