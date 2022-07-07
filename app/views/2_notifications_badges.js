const {Page, Button, Notification, NotificationStyle, H, Badge, BadgeStyle} = require('../../index');

class Notifications_Badges_Page extends Page {
    constructor() {
        super();
        this.setTitle('Уведомления и Бейджи');
        this.setMain(false)

        let h1_notifications = new H(1, "Уведомления")
        let DEFAULT = new Button("Обычное уведомление", () => {
            new Notification("Обычное уведомление").show()
        })
        let WARNING = new Button("Предупреждение", () => {
            new Notification("Предупреждение", NotificationStyle.WARNING).show()
        })
        let SUCCESS = new Button("Успешное выполнение задания", () => {
            new Notification("Успешное выполнение задания", NotificationStyle.SUCCESS).show()
        })
        let text_error = 'Уведомление: "Ошибка"';
        let ERROR = new Button(text_error, () => {
            new Notification(text_error, NotificationStyle.ERROR).show()
        })
        this.add(h1_notifications, WARNING, SUCCESS, ERROR, DEFAULT)

        let h1_badges = new H(1, "Бейджи")

        let badge_ERROR = new Badge("Текст ошибки", BadgeStyle.ERROR)
        let badge_SUCCESS = new Badge("Текст успешного выполнения", BadgeStyle.SUCCESS)
        let badge_WARNING = new Badge("Текст предупреждения", BadgeStyle.WARNING)
        let badge_CANCEL = new Badge("Обычный текст", BadgeStyle.CANCEL)

        this.add(h1_badges, badge_ERROR, badge_SUCCESS, badge_WARNING, badge_CANCEL)
    }
}

exports.Notifications_Badges_Page = Notifications_Badges_Page