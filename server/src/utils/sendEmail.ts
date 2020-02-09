import * as SparkPost from "sparkpost";
const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (recipient: string, url: string) => {
  await client.transmissions
    .send({
      options: {
        sandbox: true
      },
      content: {
        from: "testing@sparkpostbox.com",
        subject: "Confirm Email",
        html: `<html>
        <body>
        <p>Testing SparkPost - the world's most awesomest email service!</p>
        <a href="${url}">confirm email</a>
        </body>
        </html>`
      },
      recipients: [{ address: recipient }]
    })
    .then(data => {
      console.log("Woohoo! You just sent your first mailing!");
      console.log(data);
    })
    .catch(err => {
      console.log("Whoops! Something went wrong");
      console.log(err);
    });
};
