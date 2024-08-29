import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { AppRouter } from "../../server/src/index";

const wsClient = createWSClient({
  url: "ws://localhost:3000/trpc",
});

const client = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink(),
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: "http://localhost:3000/trpc",
        headers: {
          "x-ssr": "1",
        },
      }),
    }),
  ],
});

async function callQuery() {
  const result = await client.sayHi.query();
  console.log("callQuery", result);
}

async function callMutate() {
  const result = await client.logToServer.mutate("Hi from client");
  console.log("callMutate", result);
}

async function callUsersQuery() {
  const result = await client.users.get.query({ userId: "1234" });
  console.log("callUsersQuery", result);
}
async function callUsersMutate() {
  const result = await client.users.update.mutate({
    userId: "123",
    name: "Abhishek",
  });
  console.log("callUsersMutate", result);
}
async function callMiddleware() {
  const result = await client.secretData.query();
  console.log("callMiddleware", result);
}
async function callWS() {
  client.users.onUpdate.subscribe(undefined, {
    onData: (id) => {
      console.log("Updated", id);
    },
  });
  wsClient.close();
}

callQuery();
callMutate();
callUsersQuery();
callUsersMutate();
callMiddleware();
callWS();
