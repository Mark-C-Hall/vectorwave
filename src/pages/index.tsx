import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";

import ChatList from "~/components/ChatList";
import Conversation from "~/components/Conversation";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    // If the user is not signed in, redirect to the login page
    if (!isSignedIn && isLoaded) {
      router.replace("/auth/login").catch((err) => {
        console.error("Failed to redirect:", err);
      });
    }
  }, [isSignedIn, isLoaded, router]);

  // If not signed in, return null to prevent a flash of unauthorized content
  if (!isSignedIn) return null;

  return (
    <>
      <Head>
        <title>VectorWave</title>
        <meta
          name="description"
          content="Query documents with the power of AI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <ChatList
          chats={[
            { id: "1", userId: "user1", title: "Chat 1" },
            { id: "2", userId: "user1", title: "Chat 2" },
            { id: "3", userId: "user1", title: "Chat 3" },
            { id: "4", userId: "user1", title: "Chat 4" },
          ]}
        />
        <Conversation
          conversationId="1"
          messages={[
            {
              id: "1",
              createdAt: new Date(),
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In feugiat libero a dui consectetur faucibus. Sed commodo fermentum nisi, non sagittis ante sagittis vel. Praesent non placerat nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus non malesuada velit. Ut facilisis lacinia commodo. Pellentesque sit amet scelerisque nisl, nec bibendum est. Fusce lorem elit, dictum nec eleifend vel, varius a nibh. Nunc accumsan vulputate erat, nec volutpat ante mattis vel. In sed hendrerit ipsum. Integer tincidunt feugiat sollicitudin. Aenean vehicula metus id tempor scelerisque. Mauris porttitor gravida est sed consectetur. Nullam eget fermentum leo. Etiam dolor lorem, elementum vitae nibh aliquet, scelerisque lacinia ligula. Morbi cursus tellus in tellus faucibus tincidunt.\nDonec euismod, metus nec blandit hendrerit, est arcu auctor risus, eget varius lacus ex ac neque. Quisque non augue volutpat, accumsan ante a, cursus neque. Morbi dictum suscipit venenatis. Nullam hendrerit pharetra maximus. Sed elit elit, placerat ac mattis eu, placerat nec diam. Curabitur id volutpat magna, vel tristique neque. Nunc nec pellentesque metus, eu placerat purus.\nFusce ornare mauris arcu, ac ultrices magna efficitur eu. Phasellus pharetra molestie fringilla. Cras ac orci vel metus mollis malesuada. Nunc euismod, eros et commodo molestie, tortor felis consequat ex, vitae venenatis augue odio a lacus. Nam molestie tortor ac neque bibendum, nec dignissim justo pharetra. Ut et quam dolor. Maecenas lacus sem, dictum nec ornare non, cursus ac magna. Curabitur lacinia ullamcorper dui non accumsan. Nunc lacinia molestie lectus, ut vulputate urna. Praesent a nulla sed velit varius pretium. Donec rutrum vehicula ipsum non bibendum. In vel arcu in orci posuere tempor et quis risus. Aliquam ac scelerisque quam, in vestibulum neque. Praesent lacinia vel ante et pellentesque. Aenean scelerisque vulputate tellus at ultrices.",
              isFromUser: true,
              conversationId: "1",
            },
            {
              id: "2",
              createdAt: new Date(),
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In feugiat libero a dui consectetur faucibus. Sed commodo fermentum nisi, non sagittis ante sagittis vel. Praesent non placerat nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus non malesuada velit. Ut facilisis lacinia commodo. Pellentesque sit amet scelerisque nisl, nec bibendum est. Fusce lorem elit, dictum nec eleifend vel, varius a nibh. Nunc accumsan vulputate erat, nec volutpat ante mattis vel. In sed hendrerit ipsum. Integer tincidunt feugiat sollicitudin. Aenean vehicula metus id tempor scelerisque. Mauris porttitor gravida est sed consectetur. Nullam eget fermentum leo. Etiam dolor lorem, elementum vitae nibh aliquet, scelerisque lacinia ligula. Morbi cursus tellus in tellus faucibus tincidunt.\nDonec euismod, metus nec blandit hendrerit, est arcu auctor risus, eget varius lacus ex ac neque. Quisque non augue volutpat, accumsan ante a, cursus neque. Morbi dictum suscipit venenatis. Nullam hendrerit pharetra maximus. Sed elit elit, placerat ac mattis eu, placerat nec diam. Curabitur id volutpat magna, vel tristique neque. Nunc nec pellentesque metus, eu placerat purus.\nFusce ornare mauris arcu, ac ultrices magna efficitur eu. Phasellus pharetra molestie fringilla. Cras ac orci vel metus mollis malesuada. Nunc euismod, eros et commodo molestie, tortor felis consequat ex, vitae venenatis augue odio a lacus. Nam molestie tortor ac neque bibendum, nec dignissim justo pharetra. Ut et quam dolor. Maecenas lacus sem, dictum nec ornare non, cursus ac magna. Curabitur lacinia ullamcorper dui non accumsan. Nunc lacinia molestie lectus, ut vulputate urna. Praesent a nulla sed velit varius pretium. Donec rutrum vehicula ipsum non bibendum. In vel arcu in orci posuere tempor et quis risus. Aliquam ac scelerisque quam, in vestibulum neque. Praesent lacinia vel ante et pellentesque. Aenean scelerisque vulputate tellus at ultrices.",
              isFromUser: false,
              conversationId: "1",
            },
          ]}
        />
      </main>
    </>
  );
}
