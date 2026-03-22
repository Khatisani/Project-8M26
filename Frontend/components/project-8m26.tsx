"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, Shield, MapPin, X, Flower2, AlertTriangle, Heart, Home, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Screen = "home" | "branch-select" | "assessment" | "result"
type Branch = "sexual-physical" | "domestic-home" | "digital-stalking" | null

interface BranchOption {
  id: Branch
  title: string
  description: string
  icon: React.ReactNode
}

const branchOptions: BranchOption[] = [
  {
    id: "sexual-physical",
    title: "Sexual / Physical",
    description: "Assault, unwanted contact, or physical violence",
    icon: <Heart className="h-6 w-6" />,
  },
  {
    id: "domestic-home",
    title: "Domestic / Home",
    description: "Violence or abuse from someone you live with",
    icon: <Home className="h-6 w-6" />,
  },
  {
    id: "digital-stalking",
    title: "Digital / Stalking",
    description: "Online harassment, tracking, or stalking",
    icon: <Smartphone className="h-6 w-6" />,
  },
]

interface Question {
  id: string
  text: string
  options?: { label: string; value: string }[]
}

interface BranchQuestions {
  "sexual-physical": Question[]
  "domestic-home": Question[]
  "digital-stalking": Question[]
}

const branchQuestions: BranchQuestions = {
  "sexual-physical": [
    {
      id: "incidentType",
      text: "What type of incident occurred?",
      options: [
        { label: "Non-consensual penetration (Rape)", value: "rape" },
        { label: "Forced touching or kissing (Indecent Assault)", value: "assault" },
        { label: "Physical hitting or violence", value: "physical" },
      ],
    },
    {
      id: "within72Hours",
      text: "Did this happen within the last 72 hours?",
    },
    {
      id: "relationship",
      text: "Do you know the person involved?",
      options: [
        { label: "Stranger", value: "stranger" },
        { label: "Acquaintance", value: "acquaintance" },
        { label: "Partner", value: "partner" },
        { label: "Family member", value: "family" },
      ],
    },
    {
      id: "recurring",
      text: "Is this the first time this has happened, or is it a recurring situation?",
      options: [
        { label: "First time", value: "first" },
        { label: "Recurring", value: "recurring" },
      ],
    },
    {
      id: "safeLocation",
      text: "Are you currently in a safe location, away from the person involved?",
    },
  ],
  "domestic-home": [
    {
      id: "shareResidence",
      text: "Do you currently share a residence with this person?",
    },
    {
      id: "visibleInjuries",
      text: "Are there visible injuries or bruises?",
    },
    {
      id: "vulnerableOthers",
      text: "Are there children or elderly family members in the home who are also at risk?",
    },
    {
      id: "lastIncident",
      text: "When was the last time an incident occurred?",
      options: [
        { label: "Today", value: "today" },
        { label: "Within the past week", value: "week" },
        { label: "Within the past month", value: "month" },
        { label: "Longer ago", value: "longer" },
      ],
    },
    {
      id: "frequency",
      text: "How often does this happen?",
      options: [
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "Isolated escalation", value: "isolated" },
      ],
    },
  ],
  "digital-stalking": [
    {
      id: "tracking",
      text: "Is this person tracking your location (GPS/FindMy) or accessing your accounts without permission?",
    },
    {
      id: "intimateImages",
      text: "Are they threatening to share, or have they already shared, private or intimate images?",
    },
    {
      id: "blocked",
      text: "Have you already attempted to block them on all social media and communication platforms?",
    },
    {
      id: "physicalStalking",
      text: "Has the online harassment moved to physical following (stalking) or showing up at your home/work?",
    },
  ],
}

export function Project8M26() {
  const [screen, setScreen] = useState<Screen>("home")
  const [selectedBranch, setSelectedBranch] = useState<Branch>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({})
  const [isLoadingPlan, setIsLoadingPlan] = useState(false)
  const [actionPlan, setActionPlan] = useState<string | null>(null)
  const [stealthMode, setStealthMode] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<{ message: string; urgent: boolean } | null>(null)

  const currentQuestions = selectedBranch ? branchQuestions[selectedBranch] : []

  const handleStartAssessment = () => {
    setScreen("branch-select")
    setSelectedBranch(null)
    setCurrentQuestion(0)
    setAnswers({})
    setActionPlan(null)
    setCurrentAlert(null)
  }

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch)
    setScreen("assessment")
    setCurrentQuestion(0)
    setAnswers({})
    setCurrentAlert(null)
  }

  const handleAnswer = (answer: string | boolean) => {
    const questionId = currentQuestions[currentQuestion].id
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)

    const alert = getAlertForAnswer(questionId, answer, newAnswers)
    if (alert) {
      setCurrentAlert(alert)
      setTimeout(() => {
        proceedToNext(newAnswers)
      }, 3000)
    } else {
      setCurrentAlert(null)
      setTimeout(() => {
        proceedToNext(newAnswers)
      }, 300)
    }
  }

  const proceedToNext = (newAnswers: Record<string, string | boolean>) => {
    setCurrentAlert(null)
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      generateActionPlan(newAnswers)
    }
  }

  const getAlertForAnswer = (
    questionId: string,
    answer: string | boolean,
    currentAnswers: Record<string, string | boolean>
  ): { message: string; urgent: boolean } | null => {

    if (
      questionId === "within72Hours" &&
      answer === true &&
      (currentAnswers.incidentType === "rape" || currentAnswers.incidentType === "assault")
    ) {
      return {
        message:
          "FORENSIC WINDOW: You are within the critical 72-hour window. Forensic evidence can still be collected. Do not bathe or change clothes if possible. Go to a Thuthuzela Care Centre immediately for free, confidential care including PEP (HIV prevention) and emergency contraception.",
        urgent: true,
      }
    }

    if (questionId === "safeLocation" && answer === false) {
      return {
        message:
          "Your safety is the priority. If you are in immediate danger, call 10111. Try to move to a safe location as soon as possible.",
        urgent: true,
      }
    }

   
    if (questionId === "physicalStalking" && answer === true) {
      return {
        message:
          "Physical stalking is extremely dangerous. You should consider applying for a Protection Order and informing the police. Document all incidents.",
        urgent: true,
      }
    }


    if (questionId === "intimateImages" && answer === true) {
      return {
        message:
          "This is a criminal offense under the Cybercrimes Act. You can report this to the police and apply for a Protection Order under the Protection from Harassment Act.",
        urgent: false,
      }
    }

  
    if (questionId === "lastIncident" && answer === "today") {
      return {
        message:
          "If you are in danger right now, call 10111 immediately. Your safety comes first.",
        urgent: true,
      }
    }

    return null
  }

  const handleBack = () => {
    setCurrentAlert(null)
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else {
      setScreen("branch-select")
    }
  }

  const generateActionPlan = async (finalAnswers: Record<string, string | boolean>) => {
    setScreen("result")
    setIsLoadingPlan(true)
    setCurrentAlert(null)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const planItems: string[] = []

    if (selectedBranch === "sexual-physical") {

      if (finalAnswers.incidentType === "rape" || finalAnswers.incidentType === "assault") {
        planItems.push(
          "Medical Examination: Visit a Thuthuzela Care Centre for a free, confidential forensic examination and medical care. Find your nearest centre at www.saps.gov.za/fcs."
        )
      }

      if (finalAnswers.within72Hours === true) {
        planItems.push(
          "72-Hour Window: You qualify for PEP (HIV post-exposure prophylaxis) and emergency contraception. These must be started within 72 hours. Go to any hospital, clinic, or Thuthuzela Centre."
        )
        planItems.push(
          "Evidence Preservation: Do not bathe, shower, or change your clothes if possible. Place any clothes in a PAPER bag (not plastic) to preserve evidence."
        )
      }

      if (finalAnswers.relationship === "partner" || finalAnswers.relationship === "family") {
        planItems.push(
          "Domestic Violence Protection: Since the person is known to you, you may qualify for a Protection Order under the Domestic Violence Act. Apply at your nearest Magistrate's Court (free of charge)."
        )
      }

      if (finalAnswers.recurring === "recurring") {
        planItems.push(
          "Pattern of Abuse: Document each incident with dates, times, and details. This establishes a pattern that strengthens your legal case."
        )
      }

      if (finalAnswers.safeLocation === false) {
        planItems.push(
          "URGENT - Safety First: Contact POWA (People Opposing Women Abuse): 011 642 4345 for emergency shelter placement."
        )
      }
    }

    if (selectedBranch === "domestic-home") {
      if (finalAnswers.shareResidence === true) {
        planItems.push(
          "Living Situation: The Domestic Violence Act provides specific protections for you. You can apply for a Protection Order that may remove the abuser from your shared home."
        )
        planItems.push(
          "Emergency Shelter: Contact POWA: 011 642 4345 or Saartjie Baartman Centre: 021 633 5287 for emergency accommodation."
        )
      }

      if (finalAnswers.visibleInjuries === true) {
        planItems.push(
          "Medical Documentation: Get a J88 medical form completed at a hospital or clinic. This documents your injuries and is crucial evidence for court."
        )
      }

      if (finalAnswers.vulnerableOthers === true) {
        planItems.push(
          "Child/Elder Protection: Children and elderly family members at risk must be reported. Contact Childline: 0800 055 555 or the Department of Social Development."
        )
      }

      if (finalAnswers.frequency === "daily" || finalAnswers.frequency === "weekly") {
        planItems.push(
          "Ongoing Abuse: The frequency indicates a serious pattern. A Protection Order is strongly recommended. It is free to apply at the Magistrate's Court."
        )
      }

      if (finalAnswers.lastIncident === "today") {
        planItems.push(
          "Immediate Action: If you are in danger now, call SAPS Emergency: 10111. You can also go directly to your nearest police station to open a case."
        )
      }
    }

    if (selectedBranch === "digital-stalking") {
      if (finalAnswers.tracking === true) {
        planItems.push(
          "Digital Safety: Check your devices for tracking apps. Reset passwords on all accounts. Enable two-factor authentication. Consider getting a new phone or SIM card."
        )
      }

      if (finalAnswers.intimateImages === true) {
        planItems.push(
          "Cybercrimes Act: Non-consensual sharing of intimate images is a criminal offense. Report to SAPS and keep screenshots as evidence. You can also report to the Film and Publication Board."
        )
      }

      if (finalAnswers.blocked === false) {
        planItems.push(
          "Digital Boundaries: Block the person on all platforms immediately. Document all harassment with screenshots before blocking."
        )
      }

      if (finalAnswers.physicalStalking === true) {
        planItems.push(
          "URGENT - Stalking: Physical stalking is dangerous. Apply for a Protection Order under the Protection from Harassment Act at your nearest Magistrate's Court. Inform the police."
        )
        planItems.push(
          "Safety Planning: Vary your routes, inform trusted people of your schedule, and keep your phone charged. Consider a panic button app."
        )
      }
    }

    planItems.push("24/7 Support: GBV Command Centre: 0800 428 428 (Free). SMS 'Help' to 31531.")

    const formattedPlan = planItems.map((item, index) => `${index + 1}. ${item}`).join("\n\n")
    setActionPlan(formattedPlan)
    setIsLoadingPlan(false)
  }

  const handleGoHome = () => {
    setScreen("home")
    setSelectedBranch(null)
    setCurrentQuestion(0)
    setAnswers({})
    setActionPlan(null)
    setCurrentAlert(null)
  }

  if (stealthMode) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-background"
        onClick={() => setStealthMode(false)}
      >
        <div className="flex flex-col items-center gap-6 p-8">
          <Flower2 className="h-48 w-48 text-accent" strokeWidth={1} />
          <p className="text-center text-lg text-muted-foreground">
            Tap anywhere to continue
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">

      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-foreground" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Project 8M26
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStealthMode(true)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Stealth mode"
          >
            <Flower2 className="h-5 w-5" />
          </button>
          {screen !== "home" && (
            <button
              onClick={handleGoHome}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Go to home"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        {screen === "home" && <HomeScreen onStartAssessment={handleStartAssessment} />}

        {screen === "branch-select" && (
          <BranchSelectScreen onSelectBranch={handleSelectBranch} onBack={handleGoHome} />
        )}

        {screen === "assessment" && selectedBranch && (
          <AssessmentScreen
            question={currentQuestions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={currentQuestions.length}
            branchTitle={branchOptions.find((b) => b.id === selectedBranch)?.title || ""}
            onAnswer={handleAnswer}
            onBack={handleBack}
            alert={currentAlert}
          />
        )}

        {screen === "result" && (
          <ResultScreen
            isLoading={isLoadingPlan}
            actionPlan={actionPlan}
            showUrgentBanner={
              answers.safeLocation === false ||
              answers.lastIncident === "today" ||
              answers.physicalStalking === true
            }
            onGoHome={handleGoHome}
            selectedBranch={selectedBranch} 
            answers={answers}               
          />
        )}
      </main>

      <footer className="border-t border-border px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          Your information is private and never stored.
        </p>
      </footer>
    </div>
  )
}

function HomeScreen({ onStartAssessment }: { onStartAssessment: () => void }) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-balance text-2xl font-semibold text-foreground">
          You are not alone
        </h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          Confidential support is available. Tap the flower icon to hide this app quickly.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <Button
          onClick={onStartAssessment}
          size="lg"
          className="h-20 gap-3 rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
        >
          <span>Start Assessment</span>
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

function BranchSelectScreen({
  onSelectBranch,
  onBack,
}: {
  onSelectBranch: (branch: Branch) => void
  onBack: () => void
}) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">What best describes your situation?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select the option that fits best. All responses are confidential.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {branchOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectBranch(option.id)}
            className="flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-left shadow-sm transition-all hover:scale-[1.01] hover:border-primary hover:bg-secondary active:scale-[0.99]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {option.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-card-foreground">{option.title}</p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      <Button onClick={onBack} variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
    </div>
  )
}

function AssessmentScreen({
  question,
  questionNumber,
  totalQuestions,
  branchTitle,
  onAnswer,
  onBack,
  alert,
}: {
  question: Question
  questionNumber: number
  totalQuestions: number
  branchTitle: string
  onAnswer: (answer: string | boolean) => void
  onBack: () => void
  alert: { message: string; urgent: boolean } | null
}) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="text-center">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {branchTitle}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <p className="text-center text-lg font-medium leading-relaxed text-card-foreground">
            {question.text}
          </p>
        </CardContent>
      </Card>

      {alert && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 ${
            alert.urgent
              ? "border-destructive/30 bg-destructive/10"
              : "border-accent/30 bg-accent/20"
          }`}
        >
          <AlertTriangle
            className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
              alert.urgent ? "text-destructive" : "text-foreground"
            }`}
          />
          <p className="text-sm font-medium leading-relaxed text-foreground">{alert.message}</p>
        </div>
      )}

      {!alert && (
        <>
          {question.options ? (
            <div className="flex flex-col gap-3">
              {question.options.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => onAnswer(option.value)}
                  size="lg"
                  variant="outline"
                  className="h-auto min-h-[3.5rem] rounded-xl border-2 border-border bg-card px-4 py-3 text-base font-medium text-card-foreground shadow-sm transition-transform hover:scale-[1.01] hover:border-primary hover:bg-secondary active:scale-[0.99]"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => onAnswer(true)}
                size="lg"
                className="h-16 rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
              >
                Yes
              </Button>
              <Button
                onClick={() => onAnswer(false)}
                size="lg"
                variant="outline"
                className="h-16 rounded-xl border-2 border-primary bg-transparent text-lg font-semibold text-primary shadow-md transition-transform hover:scale-[1.02] hover:bg-secondary active:scale-[0.98]"
              >
                No
              </Button>
            </div>
          )}
        </>
      )}

      <Button onClick={onBack} variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
    </div>
  )
}

function ResultScreen({
  isLoading,
  actionPlan,
  showUrgentBanner,
  onGoHome,
  selectedBranch,
  answers,
}: {
  isLoading: boolean
  actionPlan: string | null
  showUrgentBanner: boolean
  onGoHome: () => void
  selectedBranch: Branch
  answers: any
}) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const downloadStealthSummary = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, branch: selectedBranch }),
      });
      
      const data = await res.json();
      
      // DECOY CONTENT: We put fake flower tips at the top to hide the real text
      const decoyHeader = "FLOWER ARRANGEMENT & DECORATION IDEAS 2026\n" +
                          "1. Use fresh water and trim stems at a 45-degree angle.\n" +
                          "2. Add a teaspoon of sugar to the vase for longevity.\n" +
                          "--------------------------------------------------\n\n";
      
      const blob = new Blob([decoyHeader + data.summary], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Flower decorations suggestions.txt'; // THE DECOY NAME
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("AI Summary failed", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {showUrgentBanner && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-destructive p-4">
          <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
          <a href="tel:10111" className="text-lg font-bold text-destructive-foreground underline">
            Call 10111 Now
          </a>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">Your Action Plan</h2>
        <p className="mt-1 text-sm text-muted-foreground italic">
          Confidential Guidance
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-primary" />
              <p className="text-sm text-muted-foreground">Preparing your action plan...</p>
            </div>
          ) : (
            <div className="whitespace-pre-line text-sm leading-relaxed text-card-foreground">
              {actionPlan}
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && (
        <div className="space-y-3">
          {/* THE GPS BUTTON (Existing) */}
          <GetHelpButton selectedBranch={selectedBranch} answers={answers} />
          
          {/* THE NEW AI STEALTH BUTTON */}
          <Button 
            onClick={downloadStealthSummary} 
            disabled={isGeneratingAI}
            variant="outline" 
            className="w-full h-12 gap-2 border-primary/20 text-muted-foreground hover:text-primary transition-all"
          >
            <Flower2 className={`h-4 w-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Processing Decoration Ideas...' : 'Save Decoration Ideas'}</span>
          </Button>

          <Button onClick={onGoHome} variant="ghost" className="w-full text-xs text-muted-foreground mt-2">
            Return Home
          </Button>
        </div>
      )}
    </div>
  )
}

function GetHelpButton({ selectedBranch, answers }: { selectedBranch: string | null, answers: any }) {
  const [isLocating, setIsLocating] = useState(false);
  const [triageData, setTriageData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetHelp = () => {
    if (!selectedBranch) {
      setError("Please complete the assessment first.");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch("http://127.0.0.1:5000/api/triage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              branch: selectedBranch,
              hours: answers?.within72Hours === true ? 12 : 80, 
            }),
          });

          if (!response.ok) throw new Error("Backend unreachable");
          const data = await response.json();
          setTriageData(data);
        } catch (err) {
          setError("Cannot connect to Python Backend.");
        } finally {
          setIsLocating(false);
        }
      },
      (_err) => {
        setError("GPS Access Denied.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3 w-full">
      <Button
        onClick={handleGetHelp}
        disabled={isLocating}
        size="lg"
        className="h-14 w-full gap-2 rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <MapPin className={`h-5 w-5 ${isLocating ? "animate-pulse" : ""}`} />
        <span>{isLocating ? "Pinpointing..." : "Find My Nearest Help Centre"}</span>
      </Button>

      {error && <p className="text-xs text-red-500 text-center">⚠️ {error}</p>}

      {triageData && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 animate-in fade-in zoom-in">
          <h4 className="text-sm font-bold">📍 {triageData.clinic}</h4>
          <p className="text-[10px] text-red-600 font-black">PRIORITY: {triageData.priority}</p>
          <div className="text-xs mt-2 space-y-1">
            {triageData.instructions.map((inst: string, i: number) => (
              <p key={i}>• {inst}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Project8M26;