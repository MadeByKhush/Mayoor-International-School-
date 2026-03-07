import "@/index.css";
import ClientProviders from "@/providers/ClientProviders";

export const metadata = {
    title: "Mayoor International School, Jodhpur | CBSE School",
    description: "Welcome to Mayoor International School in Jodhpur. A leading CBSE school dedicated to academic excellence and comprehensive student admissions.",
    openGraph: {
        title: "Mayoor International School, Jodhpur | CBSE School",
        description: "Welcome to Mayoor International School in Jodhpur. A leading CBSE school dedicated to academic excellence and comprehensive student admissions.",
        url: "https://www.mayoorinternationalschool.in/",
        siteName: "Mayoor International School",
        images: [
            {
                url: "https://www.mayoorinternationalschool.in/url_logo.jpg",
                width: 800,
                height: 600,
            },
        ],
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mayoor International School, Jodhpur | CBSE School",
        description: "Welcome to Mayoor International School in Jodhpur. A leading CBSE school dedicated to academic excellence and comprehensive student admissions.",
        images: ["https://www.mayoorinternationalschool.in/url_logo.jpg"],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-theme="light">
            <head>
                <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
            </head>
            <body className="font-display bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary transition-colors duration-300">
                <ClientProviders>
                    <div className="overflow-x-hidden w-full max-w-full">
                        {children}
                    </div>
                </ClientProviders>
            </body>
        </html>
    );
}
