import {chat} from "~/lib/chat";

export default eventHandler(async(event) => {
  const body =  await readBody(event);
  return chat(body.prompt);
});
