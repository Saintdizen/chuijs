const {Page, Button, Notification, NotificationStyle, H, Badge, BadgeStyle} = require('../../index');

class Notifications_Badges_Page extends Page {
    constructor() {
        super();
        this.setTitle('Уведомления и Бейджи');
        this.setMain(true)

        let h1_notifications = new H(1, "Уведомления")
        let DEFAULT = new Button("Обычное уведомление", () => {
            new Notification({
                title: "Заголовок уведомления 1",
                text: "Текст уведомления 1",
                showTime: 30000
            }).show()
        })
        let WARNING = new Button("Предупреждение", () => {
            new Notification({
                title: "Заголовок уведомления 2",
                text: "Текст уведомления 2",
                style: NotificationStyle.WARNING,
                showTime: 2000
            }).show()
        })
        let SUCCESS = new Button("Успешное выполнение задания", () => {
            new Notification({
                title: "Заголовок уведомления 3",
                text: "Текст уведомления 3",
                style: NotificationStyle.SUCCESS,
                showTime: 3000
            }).show()
        })
        let ERROR = new Button('Уведомление: "Ошибка"', () => {
            new Notification({
                title: "Заголовок уведомления 4",
                text: "Текст уведомления 4",
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