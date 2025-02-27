// frontend/src/components/SchedulingPanel.tsx
import React, { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Mail, X } from 'lucide-react';
import styles from './SchedulingPanel.module.css';

interface SchedulingPanelProps {
  onClose: () => void;
  visible: boolean;
}

interface FormData {
  email: string;
  date: Date | null;
  time: string;
  duration: string;
  purpose: string;
  timezone: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  date: yup.date().required('Date is required').nullable(),
  time: yup.string().required('Time is required'),
  duration: yup.string().required('Duration is required'),
  purpose: yup.string().required('Purpose is required'),
  timezone: yup.string().required('Timezone is required')
});

const SchedulingPanel: React.FC<SchedulingPanelProps> = ({ onClose, visible }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      date: null,
      time: "",
      duration: "30",
      purpose: "",
      timezone: "America/Los_Angeles"
    }
  });
  
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const email = watch('email');
  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const duration = watch('duration');
  const notes = watch('purpose');
  const timezone = watch('timezone');



  const generateTimeSlots = (duration: string) => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    let current = new Date();
    current.setHours(startHour, 0, 0, 0);
    const end = new Date();
    end.setHours(endHour, 0, 0, 0);
    
    while (current < end) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      current = new Date(current.getTime() + parseInt(duration) * 60000);
    }
    return slots;
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      
      if (result.success) {
        // Show confirmation screen instead of closing immediately
        onSuccessfulSubmit();
        // We'll keep the form data for display in the confirmation
      } else {
        setSubmitError(result.message || "There was an error scheduling your appointment. Please try again.");
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className={styles.stepIndicator}>
      {[1, 2, 3].map((num) => (
        <React.Fragment key={num}>
          <div
            className={`${styles.stepCircle} ${
              step === num ? styles.activeStep :
              step > num ? styles.completedStep : styles.inactiveStep
            }`}
          >
            {num}
          </div>
          {num < 3 && (
            <div
              className={`${styles.stepLine} ${
                step > num ? styles.completedLine : styles.inactiveLine
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep = () => {
    const commonClasses = "animate-in fade-in duration-500";
    switch (step) {
      case 1:
        return (
          <div className={`${styles.formControl} ${errors.email ? styles.invalid : ''}`}>
            <label htmlFor="email" className={styles.label}>
              <Mail className={styles.icon} />
              Enter Your Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className={styles.input}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <p id="email-error" className={styles.error} role="alert">{errors.email.message}</p>}
          </div>
        );
      case 2:
        return (
          <div>
            <div className={styles.iconHeader}>
              <CalendarIcon className={styles.icon} />
              <h2>Select a Date</h2>
            </div>
            <div>
              <div className={styles.weekHeader}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className={styles.weekDay}>
                    {day}
                  </div>
                ))}
              </div>
              <div className={styles.calendarGrid}>
                {Array.from({ length: 35 }, (_, i) => {
                  const today = new Date();
                  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                  const startingDay = new Date(firstDay);
                  // Adjust to previous Sunday if needed
                  while (startingDay.getDay() !== 0) {
                    startingDay.setDate(startingDay.getDate() - 1);
                  }
                  const date = new Date(startingDay);
                  date.setDate(date.getDate() + i);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const isPastDate = date < today;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => !isWeekend && setValue('date', date)}
                      disabled={isWeekend}
                      className={`${styles.dateButton} ${
                        isSelected ? styles.selectedDate : ''
                      } ${isWeekend ? styles.disabledDate : ''}`}
                    >
                      <span className={styles.dateNumber}>{date.getDate()}</span>
                      <span className={styles.dayName}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.date && <p className={styles.error}>{errors.date.message}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.iconHeader}>
              <Clock className={styles.icon} />
              <h2>Select Time & Duration</h2>
            </div>
            <div className={styles.formControl}>
              <label htmlFor="timezone" id="timezone-label">Your Timezone</label>
              <select 
                id="timezone" 
                {...register('timezone')}
                aria-labelledby="timezone-label"
                className={styles.selectField}
              >
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
            <div className={styles.formControl}>
              <label htmlFor="duration" id="duration-label">Meeting Duration</label>
              <select
                id="duration"
                {...register('duration')}
                aria-labelledby="duration-label"
                onChange={(e) => setValue('duration', e.target.value)}
                className={styles.selectField}
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
            <div className={styles.timeGrid}>
              {generateTimeSlots(duration).map((time) => (
                <button
                  key={time}
                  onClick={() => setValue('time', time)}
                  className={`${styles.timeButton} ${
                    selectedTime === time ? styles.selectedTime : ''
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className={styles.iconHeader}>
              <h3>Additional Notes</h3>
            </div>
            <textarea
              id="purpose"
              {...register('purpose')}
              placeholder="Please share any specific topics or questions you'd like to discuss during the appointment..."
              className={styles.textareaField}
              aria-describedby={errors.purpose ? "purpose-error" : undefined}
              aria-invalid={errors.purpose ? "true" : "false"}
            />
            {errors.purpose && <p id="purpose-error" className={styles.error} role="alert">{errors.purpose.message}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  // Adding confirmation state tracking
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const onSuccessfulSubmit = () => {
    setShowConfirmation(true);
  };
  
  return (
    <>
      {visible && (
        <div className={styles.backdrop} onClick={onClose}>
          <div className={styles.panelContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <h1>Schedule an Appointment</h1>
              <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                <X />
              </button>
            </div>

            <div className={styles.panelBody}>
              {showConfirmation ? (
                <div className={styles.confirmation}>
                  <div className={styles.confirmationIcon}>✓</div>
                  <h2>Appointment Scheduled!</h2>
                  <p>Your appointment on {selectedDate?.toLocaleDateString()} at {selectedTime} has been confirmed.</p>
                  <p>A confirmation email has been sent to {email}.</p>
                  <button onClick={() => {
                    reset();
                    setShowConfirmation(false);
                    onClose();
                  }} className={styles.closeButton}>Done</button>
                </div>
              ) : (
                <>
                  <StepIndicator />
                  {renderStep()}
                  <div className={styles.panelFooter}>
                <div className={styles.hStack}>
                  <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className={styles.navButton}
                  >
                    <ChevronLeft />
                    Back
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={handleNext}
                      disabled={(step === 1 && !!errors.email) || (step === 2 && !selectedDate)}
                      className={styles.nextButton}
                    >
                      Next
                      <ChevronRight />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit(onSubmit)}
                      disabled={!selectedTime}
                      className={styles.submitButton}
                    >
                      Book Appointment
                    </button>
                  )}
                </div>
                {submitError && <p className={styles.error} role="alert">{submitError}</p>}
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SchedulingPanel;
