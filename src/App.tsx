import { DiagramBuilder } from '@/features/telegram-bot-builder/ui'

function App() {
  return <DiagramBuilder />
}

export default App

// type TgBotChoice = {
//   text: string // текст варианта ответа (кнопка-choice в телеграмм)
//   response?: string // текст, который будет показан после выбора конкретного ответа
//   next?: string // указатель на поле name из TgBotQuestion
//   request_contact?: boolean // выбирать только из Choices // отсутствие поля эквивалентно false
// }

// type TgBotQuestion =  {
//   name: string // уникальное имя вопроса
//   question: string // текст вопроса
//   response?: string // текст, который будет показан после ответа на данный вопрос
//   choices?: TgBotChoice[] // варианты ответа на вопрос, поле опциональное или обязательное (пустой массив)?
//   next?: string // указатель на поле name из TgBotQuestion
//   only_choices?: boolean // выбирать только из Choices // отсутствие поля эквивалентно false
// }

// type TgBotConfiguration = {
//   first_node_name: string // указатель на стартовую ноду, с которой начнется опрос
//   nodes: TgBotQuestion[]
// }

// const example: TgBotConfiguration = [
//   {
//     "name": "drop_reason",
//     "question":"👋 Привет! Я заметила, что ты не дошёл(ла) до конца анкеты.\nМне важно понять почему, чтобы помочь найти тебе самую лучшую работу!",
//     "choices":[
//       {
//         "text":"💸 Зарплата ниже, чем ожидал(а)",
//         "response":"Понимаем! Мы уже добавляем новые вакансии с более высокой оплатой — скоро отправим тебе подборку 💰"
//       },
//       {
//         "text":"🙌 Напишу текстом",
//         "next":"drop_reason_handed"
//       }
//     ],
//     "next":"stay_in_touch",
//     "only_choices":true
//   },
//   {
//     "name": "drop_reason_handed",
//     "question":"Отлично! Тогда расскажи подробнее, с какими проблемами ты столкнулся 😢",
//     "next":"stay_in_touch"
//   },
//   {
//     "name": "stay_in_touch",
//     "question":"Хочешь, пришлём тебе новые вакансии, когда они появятся?\nМожно сюда или на номер телефона — как тебе удобно 😊",
//     "choices":[
//       {
//         "text":"📱 Да, оставлю номер",
//         "response":"Спасибо!\nЧтобы посмотреть, какие появились новые вакансии нажмите сюда -> /start",
//         "request_contact":true
//       },
//       {
//         "text":"✉️ Да, пиши прямо сюда",
//         "response":"Спасибо!\nЧтобы посмотреть, какие появились новые вакансии нажмите сюда -> /start"
//       },
//       {
//         "text":"❌ Не надо, спасибо",
//         "next":"finish_him"
//       }
//     ],
//     "only_choices":true
//   },
//   {
//     "name": "finish_him",
//     "question":"Напиши, почему? 😢 Это очень важно, я хочу стать лучше!",
//     "response":"Я тебя поняла!\n\nЕсли захочешь посмотреть, какие появились новые вакансии нажмите сюда -> /start"
//   }
// ]
