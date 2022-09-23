const {Page, Button, Notification, H, Badge} = require('../../index');

class Notifications_Badges_Page extends Page {
    constructor() {
        super();
        this.setTitle('Уведомления и Бейджи');
        this.setMain(true);

        let h1_notifications = new H(1, "Уведомления")
        let DEFAULT = new Button("Уведомление - Обычное", () => {
            new Notification({
                markdownTitle: "**Пожелание!**",
                markdownText: `Хорошего дня, Иван!  
                Не удивляйтесь, если увидите оформленый на вас кредит!  
                **Вы уволены!**`,
                showTime: 5000
            }).show()
        })
        let WARNING = new Button("Уведомление - Предупреждение", () => {
            new Notification({
                title: "Заголовок",
                text: "Текст",
                style: Notification.STYLE.WARNING,
                showTime: 1000
            }).show()
        })
        let SUCCESS = new Button("Уведомление - Успех", () => {
            new Notification({
                title: "Заголовок",
                text: "Текст",
                style: Notification.STYLE.SUCCESS,
                showTime: 1000
            }).show()
        })
        let ERROR = new Button('Уведомление - Ошибка', () => {
            new Notification({
                title: "Заголовок",
                text: "Текст Текст Текст Текст Текст Текст Текст Текст Текст Текст Текст Текст ",
                style: Notification.STYLE.ERROR,
                showTime: 1000
            }).show()
        })
        this.add(h1_notifications, DEFAULT, WARNING, SUCCESS, ERROR)

        let h1_badges = new H(1, "Бейджи")

        let badge_ERROR = new Badge({
            markdownText: "Текст **Ошибки**",
            style: Badge.STYLE.ERROR
        })
        let badge_SUCCESS = new Badge({
            text: "Текст успешного выполнения",
            style: Badge.STYLE.SUCCESS
        })
        let badge_WARNING = new Badge({
            text: "Текст предупреждения",
            style: Badge.STYLE.WARNING
        })
        let badge_CANCEL = new Badge({
            text: "Обычный текст",
        })

        this.add(h1_badges, badge_ERROR, badge_SUCCESS, badge_WARNING, badge_CANCEL)
    }
}

exports.Notifications_Badges_Page = Notifications_Badges_Page