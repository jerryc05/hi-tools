import * as Lark from '@larksuiteoapi/node-sdk'

const baseConfig = {
  appId: 'cli_aab44a158038dcb0',
  appSecret:
    process.env.APP_SECRET ??
    (() => {
      throw 'Missing process.env.APP_SECRET\nhttps://open.larkoffice.com/app/cli_aab44a158038dcb0/baseinfo'
    })(),
}

const client = new Lark.Client(baseConfig)
const wsClient = new Lark.WSClient(baseConfig)

wsClient.start({
  eventDispatcher: new Lark.EventDispatcher({}).register({
    'im.message.receive_v1' /* 接收消息 */: data => {
      ;(async () => {
        const {
          message: { chat_id, content, message_type, chat_type, message_id },
        } = data

        // 先回个表情
        const createReactionP = client.im.v1.messageReaction.create({
          path: { message_id },
          data: { reaction_type: { emoji_type: 'Typing' } },
        })

        // 解析用户发送的消息。
        let responseText = ''
        try {
          if (message_type === 'text') {
            responseText = JSON.parse(content).text.replace(/@_user_\d+\s+/,'')
          } else {
            responseText =
              '解析消息失败，请发送文本消息 \nparse message failed, please send text message'
          }
        } catch (error) {
          // 解析消息失败，返回错误信息。 Parse message failed, return error message.
          responseText =
            '解析消息失败，请发送文本消息 \nparse message failed, please send text message'
        }

        // // 单聊
        // if (chat_type === 'p2p') {
        //   await client.im.v1.message.create({
        //     params: {
        //       receive_id_type: 'chat_id', // 消息接收者的 ID 类型，设置为会话ID。 ID type of the message receiver, set to chat ID.
        //     },
        //     data: {
        //       receive_id: chat_id, // 消息接收者的 ID 为消息发送的会话ID。 ID of the message receiver is the chat ID of the message sending.
        //       content: JSON.stringify({
        //         text: `收到你发送的消息:${responseText}\n\n${getCurrentDateTimeString().join('\n')}`,
        //       }),
        //       msg_type: 'text', // 设置消息类型为文本消息。 Set message type to text message.
        //     },
        //   })
        // }
        // // 群聊
        // else {
        await client.im.v1.message.reply({
          path: { message_id },
          data: {
            content: JSON.stringify({
              text: `收到消息:${responseText}\n\n${getCurrentDateTimeString().join('\n')}`,
            }),
            msg_type: 'text', // 设置消息类型为文本消息。 Set message type to text message.
          },
        })
        // }

        const { reaction_id } = (await createReactionP).data ?? {}
        await Promise.all([
          reaction_id ?
            client.im.v1.messageReaction.delete({
              path: { message_id, reaction_id },
            })
          : undefined,
          client.im.v1.messageReaction.create({
            path: { message_id },
            data: { reaction_type: { emoji_type: 'DONE' } },
          }),
        ])
      })()
    },
    'im.chat.member.bot.deleted_v1' /* 机器人被移出群 */: async data => {},
    'im.chat.access_event.bot_p2p_chat_entered_v1' /* 用户进入与机器人的会话 */:
      async data => {},
    p2p_chat_create /* 用户和机器人的会话首次被创建 */: data => {
      ;(async () => {
        const { chat_id } = data

        await client.im.v1.message.create({
          params: { receive_id_type: 'chat_id' },
          data: {
            receive_id: chat_id,
            content: JSON.stringify({
              text:
                `Oh hi👋! Fancy meeting you here for the first time!\n` +
                `This is a WIP. Only God and I know what it does. Now, only God knows.🤷‍♂️`,
            }),
            msg_type: 'text', // 设置消息类型为文本消息。 Set message type to text message.
          },
        })
      })()
    },
    'im.message.reaction.created_v1' /* 新增消息表情回复 */: async data => {},
    'im.message.reaction.deleted_v1' /* 删除消息表情回复 */: async data => {},
  }),
})

function getCurrentDateTimeString() {
  const date = new Date()
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    timeZoneName: 'long',
    hour12: false,
  } as const
  return [
    new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      ...options,
    }).format(date),
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      ...options,
    }).format(date),
  ]
}
