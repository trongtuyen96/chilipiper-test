class Utils {

    static makeEmailBody(to: string, from: string, subject: string, message: string): string {
        let mailBody = [
            'Content-Type: text/plain; charset=\"UTF-8\"\n',
            'MINE-Version: 1.0\n',
            'Content-Transfer-Encoding: 7bit\n',
            `to: ${to} \n`,
            `from: ${from} \n`,
            `subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?= \n\n`,
            message
        ].join("");
        return Buffer.from(mailBody).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    }
}

export { Utils }