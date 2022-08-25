const {Page, Button, Notification, NotificationStyle, H, Badge, BadgeStyle} = require('../../index');

class Notifications_Badges_Page extends Page {
    constructor() {
        super();
        this.setTitle('Уведомления и Бейджи');
        this.setMain(true)

        let h1_notifications = new H(1, "Уведомления")
        let DEFAULT = new Button("Уведомление - Обычное", () => {
            new Notification({
                title: "Заголовок",
                text: "Текст",
                showTime: 300000
            }).show()
        })
        let WARNING = new Button("Уведомление - Предупреждение", () => {
            new Notification({
                title: "Заголовок",
                text: "Текст",
                style: NotificationStyle.WARNING,
                showTime: 2000
            }).show()
        })
        let SUCCESS = new Button("Уведомление - Успех", () => {
            new Notification({
                title: "Заголовок",
                text: "Текст",
                style: NotificationStyle.SUCCESS,
                showTime: 3000
            }).show()
        })
        let ERROR = new Button('Уведомление - Ошибка', () => {
            new Notification({
                title: "Заголовок",
                text: "Текст",
                style: NotificationStyle.ERROR,
                showTime: 4000
            }).show()
        })
        this.add(h1_notifications, DEFAULT, WARNING, SUCCESS, ERROR)

        let h1_badges = new H(1, "Бейджи")

        let badge_ERROR = new Badge("Текст ошибки", BadgeStyle.ERROR)
        let badge_SUCCESS = new Badge("Текст успешного выполнения", BadgeStyle.SUCCESS)
        let badge_WARNING = new Badge("Текст предупреждения", BadgeStyle.WARNING)
        let badge_CANCEL = new Badge("Обычный текст", BadgeStyle.CANCEL)

        this.add(h1_badges, badge_ERROR, badge_SUCCESS, badge_WARNING, badge_CANCEL)
    }
}

exports.Notifications_Badges_Page = Notifications_Badges_Page