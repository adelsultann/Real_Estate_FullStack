import prisma from "../lib/prisma.js";

// Fetches all chats involving the authenticated user.
// Enriches each chat with information about the other participant (receiver).
// Returns the enriched chat objects as a JSON response.

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    //fetches all chats where the current user is one of the participants (userIDs contains tokenUserId)
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          // hasSome is a methd in prisma
          hasSome: [tokenUserId],
        },
      },
    });
//This finds the ID of the other participant in the chat (the receiver), excluding the current user's ID. || we did this to
// extract more information from the backend to disply it on the frontend

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
        // we retrive the user info from the user database
      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        // this is to just select what we want to retrive 
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
        //Adds the receiver's information to the chat object.

      chat.receiver = receiver;
    }

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

//retrieves a chat from the database, ensuring that only users involved in the chat can access it. It also updates the chat to mark it as seen by the current user
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          //so that only user who involved to the chat can see it 
          hasSome: [tokenUserId],
        },
      },
      // to include all the messages in that chat 
      //remember the relation on chat can have many messages
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          //push operator appends the user ID to the array
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
