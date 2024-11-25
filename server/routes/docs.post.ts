import {docQuery} from "~/lib/docs";

export default eventHandler(async(event) => {
  const body =  await readBody(event);
  return docQuery(body.prompt);
});
