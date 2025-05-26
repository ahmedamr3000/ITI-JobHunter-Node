export const emailTemplate = (url) =>{
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-body p {
            font-size: 16px;
            line-height: 1.5;
        }
        .email-footer {
            text-align: center;
            padding: 20px;
            background-color: #f4f4f9;
            font-size: 14px;
            color: #888888;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Hi there!!</h1>
        </div>
        <div class="email-body">
            <p>Hello,</p>
            <p>Thank you for signing up! Please confirm your email address to get started.</p>
            <p>Click the button below to confirm your email address:</p>
            <a href="${url}" class="button">Confirm Email</a>
            <p>If you did not create this account, please ignore this email.</p>
        </div>
        <div class="email-footer">
            <p>© Node Project ITI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

}