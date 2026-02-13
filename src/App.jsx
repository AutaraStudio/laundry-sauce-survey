import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { questions } from './data/questions'
import './App.css'

gsap.registerPlugin(CustomEase)

CustomEase.create('smooth', '0.22, 1, 0.36, 1')
CustomEase.create('buttery', '0.16, 1, 0.3, 1')
CustomEase.create('imageSlide', '0.45, 0, 0.55, 1')

const STAGGER_IN = 0.07
const STAGGER_OUT = 0.04
const DURATION_IN = 0.55
const DURATION_OUT = 0.28

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxoRGIVmh-8lCugN6TUyKXvGkhVbFCkhbn4ux_SEk_i_QGAL_z1tD-RySXuf0SwyG6XAg/exec'

const THANK_YOU = {
  image: '/images/slide-6.webp',
  heading: 'Thank you for<br>your feedback!',
  body: 'Your responses help us make Laundry Sauce even better.',
  linkText: 'Scent Quiz',
  linkUrl: 'https://laundrysauce.com',
}

const Logo = ({ className }) => (
  <svg className={className} viewBox="0 0 303 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_ls)">
      <path d="M0.0820312 1.28809V23.2248H17.7717V19.6533H4.11432V1.28809H0.0820312Z" fill="currentColor"/>
      <path d="M33.8476 0L20.4258 23.225H24.7409L27.8201 17.9516L33.8476 7.53044L42.8809 23.225H47.2693L33.8476 0Z" fill="currentColor"/>
      <path d="M220.254 0L206.832 23.225H211.147L214.226 17.9516L220.254 7.53044L229.287 23.225H233.676L220.254 0Z" fill="currentColor"/>
      <path d="M58.7189 24.0052C52.681 24.0052 48.125 19.2398 48.125 12.9138V1.25684H52.1887V13.0186C52.1887 17.2394 54.8752 20.1877 58.7189 20.1877C62.5627 20.1877 65.2858 17.2394 65.2858 13.0186V1.25684H69.3495V12.9138C69.3495 19.2398 64.7778 24.0052 58.7137 24.0052" fill="currentColor"/>
      <path d="M91.2011 1.25146V16.2233L75.4804 1.25146H73.3281V23.2248H77.2557V8.32107L92.9712 23.2248H95.1235V1.25146H91.2011Z" fill="currentColor"/>
      <path d="M111.384 19.6221C113.327 19.6069 115.184 18.8213 116.548 17.4378C117.912 16.0543 118.671 14.1861 118.658 12.2435C118.66 10.9594 118.33 9.69672 117.7 8.57779C117.07 7.43917 116.144 6.49174 115.021 5.83547C113.897 5.1792 112.617 4.83846 111.316 4.84923H103.911V19.6116L111.384 19.6221ZM99.8633 23.225V1.25684H111.384C117.474 1.25684 122.617 6.28935 122.617 12.254C122.617 18.2186 117.474 23.2512 111.384 23.2512L99.8633 23.225Z" fill="currentColor"/>
      <path d="M140.966 10.4578C141.333 10.4657 141.698 10.3991 142.039 10.2621C142.38 10.1252 142.69 9.92062 142.95 9.66083C143.21 9.40103 143.414 9.09136 143.551 8.75044C143.688 8.40952 143.755 8.04439 143.747 7.67707C143.753 7.30845 143.686 6.94228 143.549 6.60003C143.412 6.25778 143.208 5.94633 142.949 5.68394C142.69 5.42154 142.381 5.21348 142.04 5.07195C141.7 4.93042 141.335 4.85827 140.966 4.85972H130.618V10.4578H140.966ZM143.391 23.225L143.249 23.0469C141.046 20.2581 139.158 17.2337 137.62 14.0292H130.618V23.225H126.586V1.25684H140.929C141.956 1.26222 142.966 1.51202 143.877 1.98557C144.787 2.45911 145.572 3.14276 146.166 3.97993L146.339 4.18941C147.016 5.2325 147.376 6.44932 147.376 7.69278C147.376 8.93624 147.016 10.1531 146.339 11.1962L146.203 11.4109H146.161C145.662 12.13 145.012 12.732 144.257 13.1751C143.502 13.6182 142.66 13.8917 141.788 13.9769C143.404 17.0035 145.348 19.8431 147.585 22.4447L148.25 23.225H143.391Z" fill="currentColor"/>
      <path d="M167.94 1.25146L160.965 10.5205L154.157 1.25146H149.156L158.677 14.1967V23.2248H162.992V14.2019L172.779 1.25146H167.94Z" fill="currentColor"/>
      <path d="M194.547 24.0052C190.918 23.9465 187.362 22.972 184.21 21.1721L183.875 20.9626L185.357 17.2079L185.839 17.4959C188.435 19.1119 191.417 20.0049 194.474 20.0828C196.873 20.0828 201.397 19.3392 201.397 16.5218C201.397 14.7099 199.742 14.0868 199.03 13.9035C197.797 13.6739 196.549 13.5357 195.296 13.4898C190.688 13.1808 184.378 12.7566 184.378 7.00668C184.378 4.47733 186.666 2.29362 188.928 1.42955C190.712 0.76638 192.603 0.443106 194.506 0.476463C197.555 0.513998 200.548 1.29792 203.225 2.75969L203.597 2.95869L202.266 6.38875L201.8 6.15833C199.36 4.95388 197.166 4.15267 194.401 4.15267C194.155 4.15267 188.331 4.18932 188.331 7.1795C188.361 7.50542 188.486 7.81533 188.691 8.07052C188.896 8.32572 189.172 8.51487 189.484 8.61437C191.201 9.32656 193.306 9.42082 195.343 9.51509C197.059 9.53003 198.767 9.73196 200.439 10.1173C203.502 10.9657 205.566 13.4845 205.566 16.4014C205.566 19.3183 203.24 24.0261 194.542 24.0261" fill="currentColor"/>
      <path d="M244.779 24.0052C238.736 24.0052 234.18 19.2398 234.18 12.9138V1.25684H238.249V13.0186C238.249 17.2394 240.935 20.1877 244.779 20.1877C248.623 20.1877 251.346 17.2394 251.346 13.0186V1.25684H255.409V12.9138C255.409 19.2398 250.838 24.0052 244.779 24.0052Z" fill="currentColor"/>
      <path d="M270.734 24.0053C267.656 23.9403 264.727 22.6723 262.574 20.4732C260.421 18.274 259.215 15.3187 259.215 12.2409C259.215 9.16311 260.421 6.20782 262.574 4.00865C264.727 1.80948 267.656 0.541488 270.734 0.476562C273.839 0.497483 276.815 1.72789 279.029 3.90664L279.374 4.24178L276.567 7.00155L276.237 6.6664C274.791 5.20166 272.828 4.363 270.77 4.33081C268.667 4.33081 266.651 5.16612 265.164 6.65299C263.677 8.13986 262.842 10.1565 262.842 12.2592C262.842 14.362 263.677 16.3786 265.164 17.8655C266.651 19.3523 268.667 20.1877 270.77 20.1877C272.833 20.1458 274.797 19.2936 276.237 17.8154L276.567 17.4803L279.374 20.2348L279.034 20.5752C277.945 21.6669 276.652 22.5321 275.227 23.1209C273.802 23.7096 272.275 24.0102 270.734 24.0053Z" fill="currentColor"/>
      <path d="M283.137 1.25146V23.2248H302.916V19.6167H287.164V14.0239H294.286V10.4524H287.164V4.85958H300.894V1.25146H283.137Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_ls">
        <rect width="302.836" height="24" fill="white" transform="translate(0.0820312)"/>
      </clipPath>
    </defs>
  </svg>
)

// Collect all .anim-item elements inside a container
function getAnimItems(container) {
  if (!container) return []
  return Array.from(container.querySelectorAll('.anim-item'))
}

// Parse URL params to pre-fill answers from email links
// URL format: ?email=user@example.com&name=John&q=1&a=2
function getEmailPrefill() {
  try {
    const params = new URLSearchParams(window.location.search)

    // Always capture email and name
    const email = params.get('email') || ''
    const name = params.get('name') || ''

    const qParam = params.get('question') || params.get('q')
    const aParam = params.get('answer') ?? params.get('a')

    if (!qParam || aParam === null) {
      return { email, name, answers: {}, startStep: 0 }
    }

    const qIndex = parseInt(qParam, 10) - 1
    if (isNaN(qIndex) || qIndex < 0 || qIndex >= questions.length) {
      return { email, name, answers: {}, startStep: 0 }
    }

    const question = questions[qIndex]
    if (!question.options) {
      return { email, name, answers: {}, startStep: 0 }
    }

    const aIndex = parseInt(aParam, 10) - 1
    if (isNaN(aIndex) || aIndex < 0 || aIndex >= question.options.length) {
      return { email, name, answers: {}, startStep: 0 }
    }
    const answerValue = question.options[aIndex]

    let startStep = qIndex + 1
    if (startStep >= questions.length) startStep = questions.length - 1

    return {
      email,
      name,
      answers: { [question.id]: answerValue },
      startStep,
    }
  } catch {
    return { email: '', name: '', answers: {}, startStep: 0 }
  }
}

const emailPrefill = getEmailPrefill()

function App() {
  const [currentStep, setCurrentStep] = useState(emailPrefill?.startStep ?? 0)
  const [answers, setAnswers] = useState(emailPrefill?.answers ?? {})
  const [error, setError] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const formAreaRef = useRef(null)
  const submitWrapRef = useRef(null)
  const imagePanelRef = useRef(null)
  const currentImageRef = useRef(null)
  const nextImageRef = useRef(null)
  const thankYouRef = useRef(null)
  const surveyContainerRef = useRef(null)
  const autoAdvanceTimer = useRef(null)

  const answersRef = useRef(emailPrefill?.answers ?? {})
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  // ─── Submit to Google Sheet ───
  const submitToSheet = useCallback((finalAnswers) => {
    const payload = {
      email: emailPrefill?.email || '',
      name: emailPrefill?.name || '',
      q1: finalAnswers[1] || '',
      q2: finalAnswers[2] || '',
      q3: finalAnswers[3] || '',
      q4: Array.isArray(finalAnswers[4]) ? finalAnswers[4].join(', ') : finalAnswers[4] || '',
      q5: finalAnswers[5] || '',
      q6: finalAnswers[6] || '',
    }

    fetch(SHEET_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).catch((err) => console.error('Sheet submit error:', err))
  }, [])

  // Refs to always get latest transition functions (avoids stale closures in setTimeout)
  const transitionToStepRef = useRef(null)
  const transitionToThankYouRef = useRef(null)

  const current = questions[currentStep]
  const totalQuestions = questions.length

  const currentAnswer = answers[current.id]
  const hasAnswer = (() => {
    if (current.type === 'multi') return currentAnswer && currentAnswer.length > 0
    return currentAnswer !== undefined && currentAnswer !== ''
  })()

  // Check if Q6 should be shown based on Q5 answer
  const shouldShowQ6 = (answer) => {
    return ['Unsure', 'Unlikely', 'Very unlikely'].includes(answer)
  }

  // Only show button on multi-select and text slides (single-select auto-advances)
  const showButton = current.type === 'multi' || current.type === 'text'
  const isFinalStep = currentStep === questions.length - 1

  // Button text logic
  const buttonText = (() => {
    if (isFinalStep) return 'Submit'
    // Q5 (index 4): show Submit if positive (goes straight to thank you)
    if (currentStep === 4) {
      if (currentAnswer && !shouldShowQ6(currentAnswer)) return 'Submit'
    }
    return 'Next'
  })()

  // Progress display
  const progressLabel = (() => {
    if (showThankYou) return 'Complete!'
    if (current.conditional && currentStep === questions.length - 1) return 'Complete!'
    return `${currentStep + 1} of ${totalQuestions}`
  })()

  const progressPercent = (() => {
    if (showThankYou) return 100
    if (current.conditional && currentStep === questions.length - 1) return 100
    return ((currentStep + 1) / totalQuestions) * 100
  })()

  // Preload all images on mount + clean URL params
  useEffect(() => {
    questions.forEach((q) => {
      const img = new Image()
      img.src = q.image
    })
    const thankImg = new Image()
    thankImg.src = THANK_YOU.image

    // Clean email prefill params from URL
    if (emailPrefill) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // ─── Staggered entrance animation ───
  useLayoutEffect(() => {
    if (showThankYou) return

    const items = getAnimItems(formAreaRef.current)
    const btn = submitWrapRef.current

    gsap.set(items, { opacity: 0, y: 18, filter: 'blur(8px)' })
    if (btn) gsap.set(btn, { opacity: 0, y: 14, filter: 'blur(6px)' })

    const tl = gsap.timeline({ delay: 0.08 })

    items.forEach((el, i) => {
      tl.to(el, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: DURATION_IN,
        ease: 'buttery',
      }, i * STAGGER_IN)
    })

    if (btn) {
      tl.to(btn, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: DURATION_IN,
        ease: 'buttery',
      }, items.length * STAGGER_IN + 0.02)
    }

    return () => tl.kill()
  }, [currentStep, showThankYou])

  // ─── Transition to thank you: just flip the flag ───
  const transitionToThankYou = useCallback(() => {
    if (isAnimating || showThankYou) return
    setIsAnimating(true)
    setError('')
    setShowThankYou(true)
  }, [isAnimating, showThankYou])

  // ─── Animate thank-you overlay once it mounts ───
  useEffect(() => {
    if (!showThankYou || !thankYouRef.current) return

    const tyItems = getAnimItems(thankYouRef.current)
    gsap.set(thankYouRef.current, { opacity: 0 })
    gsap.set(tyItems, { opacity: 0, y: 24, filter: 'blur(10px)' })

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    })

    // Fade out the entire survey
    if (surveyContainerRef.current) {
      tl.to(surveyContainerRef.current, {
        opacity: 0,
        scale: 0.97,
        filter: 'blur(6px)',
        duration: 0.7,
        ease: 'power2.inOut',
      }, 0)
    }

    // Crossfade in the thank you backdrop
    tl.to(thankYouRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut',
    }, 0.15)

    // Stagger in thank you content elements
    tyItems.forEach((el, i) => {
      tl.to(el, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'buttery',
      }, 0.4 + i * 0.12)
    })

    return () => tl.kill()
  }, [showThankYou])

  // ─── Staggered exit + image slide ───
  const transitionToStep = useCallback((nextStep) => {
    if (isAnimating) return
    setIsAnimating(true)
    setError('')

    const items = getAnimItems(formAreaRef.current)
    const btn = submitWrapRef.current
    const allEls = btn ? [...items, btn] : items

    const nextQuestion = questions[nextStep]

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentStep(nextStep)
        setIsAnimating(false)
      }
    })

    // Stagger out — reverse order for cascading feel
    const reversed = [...allEls].reverse()
    reversed.forEach((el, i) => {
      tl.to(el, {
        opacity: 0,
        y: -10,
        filter: 'blur(6px)',
        duration: DURATION_OUT,
        ease: 'smooth',
      }, i * STAGGER_OUT)
    })

    // Slide images
    if (
      currentImageRef.current &&
      nextImageRef.current &&
      imagePanelRef.current &&
      nextQuestion?.image
    ) {
      const currentQ = questions[currentStep]
      const imageChanging = currentQ?.image !== nextQuestion.image

      if (imageChanging) {
        const panelHeight = imagePanelRef.current.offsetHeight

        nextImageRef.current.src = nextQuestion.image
        gsap.set(nextImageRef.current, { y: panelHeight, opacity: 1, force3D: true })
        gsap.set(currentImageRef.current, { force3D: true })

        tl.to(currentImageRef.current, {
          y: -panelHeight,
          duration: 0.7,
          ease: 'imageSlide',
          force3D: true,
        }, 0)

        tl.to(nextImageRef.current, {
          y: 0,
          duration: 0.7,
          ease: 'imageSlide',
          force3D: true,
        }, 0)
      }
    }
  }, [isAnimating, currentStep])

  // Keep refs in sync
  transitionToStepRef.current = transitionToStep
  transitionToThankYouRef.current = transitionToThankYou

  // Reset images after step change
  useEffect(() => {
    if (showThankYou) return
    if (currentImageRef.current) {
      currentImageRef.current.src = questions[currentStep].image
      gsap.set(currentImageRef.current, { y: 0, opacity: 1 })
    }
    if (nextImageRef.current) {
      gsap.set(nextImageRef.current, { y: 0, opacity: 0 })
    }
  }, [currentStep, showThankYou])

  // Single select — store value and auto-advance
  const handleSingleSelect = useCallback((option) => {
    if (isAnimating) return
    setError('')

    // Clear any pending auto-advance
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current)
      autoAdvanceTimer.current = null
    }

    const updated = { ...answersRef.current, [current.id]: option }
    answersRef.current = updated
    setAnswers(updated)

    // Auto-advance after a beat so user sees their selection
    autoAdvanceTimer.current = setTimeout(() => {
      autoAdvanceTimer.current = null

      const nextStep = currentStep + 1
      const nextQuestion = questions[nextStep]

      // Check if next question is conditional and should be skipped
      if (nextQuestion && nextQuestion.conditional) {
        if (!shouldShowQ6(option)) {
          // Skip Q6, go straight to thank you
          submitToSheet(updated)
          transitionToThankYouRef.current?.()
          return
        }
      }

      // If this was the last step, go to thank you
      if (currentStep >= questions.length - 1) {
        submitToSheet(updated)
        transitionToThankYouRef.current?.()
        return
      }

      transitionToStepRef.current?.(nextStep)
    }, 350)
  }, [current.id, isAnimating, currentStep, submitToSheet])

  // Multi select toggle
  const handleMultiToggle = (option) => {
    if (isAnimating) return
    setError('')
    setAnswers(prev => {
      const existing = prev[current.id] || []
      const updated = existing.includes(option)
        ? existing.filter(o => o !== option)
        : [...existing, option]
      const newAnswers = { ...prev, [current.id]: updated }
      answersRef.current = newAnswers
      return newAnswers
    })
  }

  // Text input
  const handleTextChange = (value) => {
    setError('')
    const updated = { ...answersRef.current, [current.id]: value }
    answersRef.current = updated
    setAnswers(updated)
  }

  // Submit / Next
  const handleSubmit = useCallback(() => {
    if (isAnimating || showThankYou) return

    // Cancel any pending auto-advance
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current)
      autoAdvanceTimer.current = null
    }

    if (!hasAnswer) {
      setError('Please complete this question before continuing')
      return
    }
    setError('')

    // If on final step, submit and go to thank you
    if (isFinalStep) {
      submitToSheet(answersRef.current)
      transitionToThankYou()
      return
    }

    // Determine next step
    const nextStep = currentStep + 1
    const nextQuestion = questions[nextStep]

    // If next question is conditional, check if it should show
    if (nextQuestion && nextQuestion.conditional) {
      const currentVal = currentAnswer
      if (!shouldShowQ6(currentVal)) {
        // Skip Q6, go straight to thank you
        submitToSheet(answersRef.current)
        transitionToThankYou()
        return
      }
    }

    transitionToStep(nextStep)
  }, [hasAnswer, isFinalStep, isAnimating, showThankYou, currentStep, currentAnswer, transitionToStep, transitionToThankYou, submitToSheet])

  // Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !showThankYou && showButton) {
        e.preventDefault()
        handleSubmit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSubmit, showThankYou, showButton])

  useEffect(() => {
    setError('')
  }, [currentStep])

  // Clean up auto-advance timer
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
    }
  }, [])

  return (
    <>
      <div className="survey-container" ref={surveyContainerRef}>
        {/* LEFT - Image */}
        <div className="survey-image-panel" ref={imagePanelRef}>
          <img ref={currentImageRef} src={current.image} alt="" className="survey-image" />
          <img ref={nextImageRef} src="" alt="" className="survey-image" style={{ opacity: 0 }} />
        </div>

        {/* RIGHT - Form */}
        <div className="survey-form-panel">
          <div className="survey-logo-wrapper">
            <Logo className="survey-logo" />
          </div>

          <div className="survey-form-center">
            <div className="survey-progress-wrapper">
              <div className="survey-progress-label">{progressLabel}</div>
              <div className="survey-progress-track">
                <div className="survey-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="survey-form-scroll" ref={formAreaRef}>
              <div className="survey-content">
                <h2 className="anim-item survey-question">{current.question}</h2>
                {current.subtitle && (
                  <p className="anim-item survey-subtitle">{current.subtitle}</p>
                )}

                <div className="anim-item survey-options-wrapper">
                  <div className="survey-options">

                    {/* Single Select */}
                    {current.type === 'single' && current.options.map((opt) => (
                      <button
                        key={opt}
                        className={`option-btn ${currentAnswer === opt ? 'selected' : ''}`}
                        onClick={() => handleSingleSelect(opt)}
                      >
                        {opt}
                      </button>
                    ))}

                    {/* Multi Select */}
                    {current.type === 'multi' && current.options.map((opt) => {
                      const isChecked = (currentAnswer || []).includes(opt)
                      return (
                        <label key={opt} className={`option-checkbox ${isChecked ? 'selected' : ''}`}>
                          <input type="checkbox" checked={isChecked} onChange={() => handleMultiToggle(opt)} />
                          <span className="check-indicator">
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="checkbox-label-text">{opt}</span>
                        </label>
                      )
                    })}

                    {/* Text */}
                    {current.type === 'text' && (
                      <textarea
                        className="option-textarea"
                        placeholder="Type your answer here..."
                        rows={5}
                        value={currentAnswer || ''}
                        onChange={(e) => handleTextChange(e.target.value)}
                      />
                    )}
                  </div>

                  <div className={`error-tooltip ${error ? 'visible' : ''}`}>{error}</div>
                </div>
              </div>

              {showButton && (
                <div ref={submitWrapRef} className="survey-submit">
                  <button className="submit-btn" onClick={handleSubmit}>
                    {buttonText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thank You — full-screen crossfade overlay */}
      {showThankYou && (
        <div ref={thankYouRef} className="thankyou-screen" style={{ opacity: 0 }}>
          <img src={THANK_YOU.image} alt="" className="thankyou-bg" />
          <div className="thankyou-overlay" />
          <div className="thankyou-content">
            <div className="anim-item"><Logo className="thankyou-logo" /></div>
            <h1 className="anim-item thankyou-heading" dangerouslySetInnerHTML={{ __html: THANK_YOU.heading }} />
            <p className="anim-item thankyou-body">
              {THANK_YOU.body}<br />
              Get started with our <a href={THANK_YOU.linkUrl}>{THANK_YOU.linkText}</a>!
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default App