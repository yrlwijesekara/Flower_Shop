import React from 'react';
import './ProgressSteps.css';

const ProgressSteps = ({ currentStep = 1, steps = [] }) => {
  const defaultSteps = [
    { number: 1, label: 'Shopping Cart' },
    { number: 2, label: 'Checkout Details' },
    { number: 3, label: 'Order Complete' }
  ];

  const stepData = steps.length > 0 ? steps : defaultSteps;

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <div className="progress-steps">
      {stepData.map((step, index) => {
        const stepStatus = getStepStatus(step.number);
        const isLastStep = index === stepData.length - 1;
        
        return (
          <div key={step.number} className={`step ${stepStatus}`}>
            <div className="step-circle">
              <span>{step.number}</span>
            </div>
            <span className="step-label">{step.label}</span>
            {!isLastStep && <div className="step-arrow"></div>}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;