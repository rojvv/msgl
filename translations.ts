export default {
  en: {
    name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 English",
    initialMessageText: "Click the button below.",
    buttonText: "Click Me",
    numberFormat: new Intl.NumberFormat("en"),
    remaining(amount: number, percentage: number) {
      const percentageString = this.numberFormat.format(percentage) + "%";
      const amountString = this.numberFormat.format(amount);
      const s = amount == 1 ? "" : "s";
      return `${percentageString}\n\nThis chat has ${amountString} message${s} remaining before older ones start to disappear.`;
    },
    disappeared(amount: number, percentage: number) {
      const percentageString = this.numberFormat.format(percentage) + "%";
      const amountString = this.numberFormat.format(amount);
      return `${percentageString}\n\nThis chat already has at least ${amountString} of its messages disappeared.`;
    },
  },
  ru: {
    name: "🇷🇺 русский",
    initialMessageText: "Нажмите на кнопку ниже.",
    buttonText: "Нажми на меня",
    numberFormat: new Intl.NumberFormat("ru"),
    remaining(amount: number, percentage: number) {
      let messages = "сообщений";
      const lastChar = amount.toString().slice(-1)[0];
      const beforeLastChar = amount.toString().slice(-2)[0];
      if (amount == 1) {
        messages = "сообщение";
      } else if (["2", "3", "4"].includes(lastChar) && beforeLastChar != "1") {
        messages = "сообщения";
      }
      const amountString = this.numberFormat.format(amount);
      const percentageString = this.numberFormat.format(percentage) + "%";
      return `${percentageString}\n\nВ этом чате осталось ${amountString} ${messages}, прежде чем старые начнут исчезать.`;
    },
    disappeared(amount: number, percentage: number) {
      const amountString = this.numberFormat.format(amount);
      const percentageString = this.numberFormat.format(percentage) + "%";
      let messages = "сообщения";
      if (amount != 1) {
        messages = "сообщений";
      }
      return `${percentageString}\n\nВ этом чате уже исчезло не менее ${amountString} ${messages}.`;
    },
  },
} as const;
