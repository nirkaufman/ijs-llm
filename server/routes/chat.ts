import {chat} from "~/lib/chat";


export default eventHandler((event) => {
  return chat("who are you?");
});
