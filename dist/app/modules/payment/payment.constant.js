"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failPage = exports.successPage = void 0;
exports.successPage = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
        />
        <title>Payment Success</title>
        <style>
            :root {
                --primary: 47.9 95.8% 53.1%;
                --primary-foreground: 26 83.3% 14.1%;
                --secondary: 60 4.8% 95.9%;
                --secondary-foreground: 24 9.8% 10%;
                --destructive: 0 84.2% 60.2%;
                --destructive-foreground: 60 9.1% 97.8%;
            }
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Open Sans', sans-serif;
                background-color: hsl(var(--secondary));
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }

            .container {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: 24px;
                padding: 24px;
                text-align: center;
                max-width: 500px;
                width: 100%;
            }

            .title {
                color: #28a745;
                font-size: 24px;
                margin: 0 0 20px 0;
            }

            p {
                color: hsl(var(--primary-foreground));
                font-size: 16px;
                margin: 0 0 20px 0;
            }

            .cta-button {
                background-color: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                border: none;
                border-radius: 4px;
                padding: 12px 24px;
                font-size: 16px;
                text-decoration: none;
                display: inline-block;
                cursor: pointer;
                transition: background-color 0.5s ease;
            }

            .cta-button:hover {
                filter: brightness(102%);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">Payment Successful!</h1>
            <p>
                Your payment has been processed successfully. Thank you for
                booking.
            </p>
            <a href="{{dashboard-link}}" class="cta-button">Go to Dashboard</a>
        </div>
    </body>
</html>
`;
exports.failPage = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
        />
        <title>Payment Success</title>
        <style>
            :root {
                --background: 20 14.3% 4.1%;
                --foreground: 60 9.1% 97.8%;
                --card: 20 14.3% 4.1%;
                --card-foreground: 60 9.1% 97.8%;
                --popover: 20 14.3% 4.1%;
                --popover-foreground: 60 9.1% 97.8%;
                --primary: 47.9 95.8% 53.1%;
                --primary-foreground: 26 83.3% 14.1%;
                --secondary: 12 6.5% 15.1%;
                --secondary-foreground: 60 9.1% 97.8%;
                --muted: 12 6.5% 15.1%;
                --muted-foreground: 24 5.4% 63.9%;
                --accent: 12 6.5% 15.1%;
                --accent-foreground: 60 9.1% 97.8%;
                --destructive: 0 62.8% 30.6%;
                --destructive-foreground: 60 9.1% 97.8%;
                --border: 12 6.5% 15.1%;
                --input: 12 6.5% 15.1%;
            }
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Open Sans', sans-serif;
                background-color: hsl(var(--secondary));
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }

            .container {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: 24px;
                padding: 24px;
                text-align: center;
                max-width: 500px;
                width: 100%;
            }

            .title {
                color: hsl(var(--destructive));
                font-size: 24px;
                margin: 0 0 20px 0;
            }

            p {
                color: hsl(var(--primary-foreground));
                font-size: 16px;
                margin: 0 0 20px 0;
            }

            .cta {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 16px;
            }

            .primary-cta {
                background-color: hsl(var(--primary));
                color: hsl(var(--primary-foreground));
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                border: none;
                border-radius: 4px;
                padding: 12px 24px;
                font-size: 16px;
                text-decoration: none;
                display: inline-block;
                cursor: pointer;
                transition: background-color 0.5s ease;
            }

            .primary-cta:hover {
                filter: brightness(102%);
            }

            .secondary-cta {
                background-color: #ffffff;
                color: hsl(var(--input));
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                border: 1px solid hsl(var(--input));
                border-radius: 4px;
                padding: 12px 24px;
                font-size: 16px;
                text-decoration: none;
                display: inline-block;
                cursor: pointer;
                transition: background-color 0.5s ease;
            }

            .secondary-cta:hover {
                background-color: hsl(var(--accent));
                color: hsl(var(--accent-foreground));
            }

            @media screen and (max-width: 400px) {
                .cta {
                    flex-direction: column;
                }
                .primary-cta,
                .secondary-cta {
                    width: 80%;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">Payment Failed!</h1>
            <p>
                Oops! Something went wrong with your payment. Please try again
                or contact support if you need assistance.
            </p>
            <div class="cta">
                <a href="{{back-link}}" class="secondary-cta">Go Back</a>
                <a href="{{retry-link}}" class="primary-cta">Retry Payment</a>
            </div>
        </div>
    </body>
</html>
`;
