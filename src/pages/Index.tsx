import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shirt, Settings, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import JCILogo from "@/components/JCILogo";
import ProgressBar from "@/components/ProgressBar";
import StatusCards from "@/components/StatusCards";
import MemberSearch from "@/components/MemberSearch";
import SizeSelector from "@/components/SizeSelector";
import SuccessView from "@/components/SuccessView";
import SubmissionList from "@/components/SubmissionList";
import SizeChart from "@/components/SizeChart";
import AdminPanel from "@/components/AdminPanel";
import { getMembers, type Member } from "@/lib/members";

type Step = "home" | "search" | "size" | "success" | "error" | "admin";

const Index = () => {
  const [step, setStep] = useState<Step>("home");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [message, setMessage] = useState("");
  const [, setRefresh] = useState(0);

  const members = getMembers();
  const total = 84; // Fixed total members count
  const submitted = members.filter((m) => m.is_submitted).length;

  const forceRefresh = useCallback(() => setRefresh((r) => r + 1), []);

  const handleMemberSelect = (member: Member) => {
    if (member.is_submitted) {
      setMessage("You have already submitted your T-shirt size.");
      setStep("error");
      return;
    }
    setSelectedMember(member);
    setStep("size");
  };

  const handleSuccess = (msg: string) => {
    setMessage(msg);
    setStep("success");
    forceRefresh();
  };

  const handleError = (msg: string) => {
    setMessage(msg);
    setStep("error");
  };

  const reset = () => {
    setStep("home");
    setSelectedMember(null);
    setMessage("");
    forceRefresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <JCILogo className="h-14 mx-auto" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            T-Shirt Size Submission
          </h1>
          <p className="text-sm text-muted-foreground">Powered by Mannai Turf50</p>
        </motion.header>

        {/* Progress */}
        <ProgressBar submitted={submitted} total={total} />

        <AnimatePresence mode="wait">
          {step === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <StatusCards total={total} submitted={submitted} />

              <Button
                onClick={() => setStep("search")}
                className="w-full h-14 text-base font-bold rounded-xl gap-2"
              >
                <Shirt className="h-5 w-5" />
                Submit My Size
              </Button>

              <SizeChart />
              <SubmissionList />

              {/* Admin & Share */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("admin")}
                  className="gap-1"
                >
                  <Settings className="h-4 w-4" /> Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-1"
                >
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      "JCI Mannai Members,\n\nPlease submit your T-shirt size using the link below:\n" +
                      window.location.origin +
                      "\n\nThank you!\nPowered by Mannai Turf50"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </a>
                </Button>
              </div>
            </motion.div>
          )}

          {step === "search" && (
            <motion.div key="search" exit={{ opacity: 0, x: -20 }}>
              <MemberSearch onSelect={handleMemberSelect} />
              <Button variant="ghost" onClick={reset} className="mt-4 text-muted-foreground">
                ← Back
              </Button>
            </motion.div>
          )}

          {step === "size" && selectedMember && (
            <motion.div key="size" exit={{ opacity: 0, x: -20 }}>
              <SizeSelector
                member={selectedMember}
                onSuccess={handleSuccess}
                onError={handleError}
                onBack={() => setStep("search")}
              />
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success">
              <SuccessView message={message} onReset={reset} />
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4 py-8"
            >
              <div className="text-5xl">⚠️</div>
              <p className="text-foreground font-semibold">{message}</p>
              <Button onClick={reset}>Back to Home</Button>
            </motion.div>
          )}

          {step === "admin" && (
            <motion.div key="admin">
              <AdminPanel onClose={reset} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-8 pb-4">
          © 2026 JCI Mannai · Powered by Mannai Turf50
        </footer>
      </div>
    </div>
  );
};

export default Index;
