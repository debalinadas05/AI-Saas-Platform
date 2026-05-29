import React from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Write articles (unlimited)',
      '10 blog title generations',
      'Access to community',
      'Basic support',
    ],
    cta: 'Get started',
    gradient: 'from-[#3588F2] to-[#0BB0D7]',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$19',
    period: 'per month',
    description: 'Everything you need to create at scale',
    features: [
      'Everything in Free',
      'Unlimited blog titles',
      'AI image generation',
      'Background removal',
      'Object removal',
      'Resume review',
      'Priority support',
    ],
    cta: 'Upgrade to Premium',
    gradient: 'from-[#FF61C5] to-[#9E53EE]',
    highlight: true,
  },
]

const Plan = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className='max-w-4xl mx-auto z-20 my-30 px-4'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>Choose Your Plan</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>
          Start for free and scale up as you grow. Find the perfect plan
          for your content creation needs.
        </p>
      </div>

      <div className='mt-14 flex flex-wrap justify-center gap-8'>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`w-full max-w-sm rounded-2xl border p-8 flex flex-col gap-5
            ${plan.highlight
                ? 'border-purple-200 shadow-xl shadow-purple-100'
                : 'border-gray-200 shadow-md'
              }`}
          >
            {/* Badge */}
            {plan.highlight && (
              <span className='self-start text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-[#FF61C5] to-[#9E53EE] text-white'>
                Most Popular
              </span>
            )}

            <div>
              <h3 className='text-xl font-semibold text-slate-700'>{plan.name}</h3>
              <p className='text-gray-400 text-sm mt-1'>{plan.description}</p>
            </div>

            <div className='flex items-end gap-1'>
              <span className='text-4xl font-bold text-slate-800'>{plan.price}</span>
              <span className='text-gray-400 text-sm mb-1'>/{plan.period}</span>
            </div>

            <ul className='flex flex-col gap-3'>
              {plan.features.map((feature) => (
                <li key={feature} className='flex items-center gap-2 text-sm text-slate-600'>
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Check className='w-3 h-3 text-white' />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate(user ? '/ai' : '/register')}
              className={`mt-auto w-full py-2.5 rounded-lg text-sm font-medium text-white
              bg-gradient-to-r ${plan.gradient} hover:opacity-90 transition cursor-pointer`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Plan