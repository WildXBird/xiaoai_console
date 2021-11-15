import { GithubAPIKEY } from "../config/key"
import { Notification } from '../unit/type';


export async function GetGithubNotifications(): Promise<Notification[]> {
    const API_KEY: string = GithubAPIKEY()
    let xhr = new XMLHttpRequest()
    xhr.open("GET", `https://api.github.com/notifications?page=1&per_page=100`, true)
    xhr.send()
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            try {
                let data = JSON.parse(xhr.responseText);
                let response: string[] = []
                for (let url of data) {
                    response.push(String(url))
                }
            } catch (error) {
            }
        }
    }
return []
}

