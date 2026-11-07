import { createFileRoute } from "@tanstack/react-router";
import "../styles.css";
import { AccountPortal } from "../components/AccountPortal";
import { AccountSection } from "../components/home/AccountSection";
import {
  Footer,
  Header,
  Hero,
  Inspiration,
} from "../components/home/LandingSections";
import { useHomeAccount } from "../components/home/useHomeAccount";

export const Route = createFileRoute("/")({ component: Home });

export default function Home() {
  const account = useHomeAccount();
  const { accountEmail, accessToken, session } = account;
  return (
    <div className="min-h-screen bg-[#f8f9f4] text-[#173c2d] selection:bg-[#d4eac7]">
      <Header accountEmail={accountEmail} />
      <main id="top">
        <Hero />
        <Inspiration />
        <AccountSection account={account} />
        {accountEmail && accessToken && (
          <AccountPortal key={session?.user.id} accessToken={accessToken} />
        )}
      </main>
      <Footer />
    </div>
  );
}
