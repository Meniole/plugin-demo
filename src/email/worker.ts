import { EmailMessage } from "@cloudflare/workers-types";
import { Env } from "../types";
import { acceptCollaboratorInvitation } from "./collaborator-invitation";

export default {
  async email(message: EmailMessage & { headers: { get: (s: string) => string } }, env: Env) {
    console.log(JSON.stringify(message));
    console.log("Received email from:", message.from);
    console.log("To:", message.to);
    if (message.from === "noreply@github.com") {
      const subject = message.headers.get("subject");
      const reg = new RegExp(/invited you to (\S+\/\S+)/, "i");
      const matches = reg.exec(subject);
      if (matches) {
        const [owner, repo] = matches[1].split("/");
        await acceptCollaboratorInvitation(owner, repo, env);
        // await message.forward("ubiquity-os-simulant@ubq.fi");
      }
    } else {
      // message.setReject(`Unknown address ${message.to}`);
    }
  },
};
