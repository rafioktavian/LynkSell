'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LynksellLandingClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    // Parallax & Scroll Progress
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const scrollProgress = document.getElementById('scroll-progress');
      if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = (window.scrollY / docHeight) * 100;
        scrollProgress.style.width = `${scrollPct}%`;
      }

      if (window.innerWidth >= 768) {
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        parallaxLayers.forEach((layer) => {
          const speed = parseFloat((layer as HTMLElement).dataset.speed || '0');
          const yPos = -(window.scrollY * speed);
          (layer as HTMLElement).style.transform = `translateY(${yPos}px)`;
        });

        const mockupWrap = document.querySelector('.mockup-wrap');
        if (mockupWrap) {
          const yPos = -(window.scrollY * 0.08);
          (mockupWrap as HTMLElement).style.transform = `translateY(${Math.max(yPos, -150)}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Animate counters if present
          if (entry.target.classList.contains('value-card')) {
            const numEl = entry.target.querySelector('.value-num[data-count]') as HTMLElement;
            if (numEl && !numEl.dataset.animated) {
              const target = parseInt(numEl.dataset.count || '0');
              const suffix = numEl.dataset.suffix || '';
              animateCounter(numEl, target, suffix);
              numEl.dataset.animated = 'true';
            }
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const animateCounter = (el: HTMLElement, target: number, suffix: string) => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.floor(easeProgress * target);
      el.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --color-bg: #FFFFFF;
          --color-surface: #F8FAFC;
          --color-border: #E2E8F0;
          --color-primary: #4F46E5;
          --color-primary-hover: #4338CA;
          --color-primary-light: #EEF2FF;
          --color-text: #0F172A;
          --color-text-sec: #64748B;
          --color-highlight: #EEF2FF;
          --font-lora: 'Lora', serif; /* Or keep Plus Jakarta Sans if you want */
        }

        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: var(--color-primary);
          color: white;
          padding: 8px;
          z-index: 100;
          transition: top 0.2s;
        }
        .skip-link:focus {
          top: 0;
        }

        #scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: var(--color-primary);
          width: 0%;
          z-index: 9999;
          transition: width 0.1s linear;
        }

        /* Nav */
        header {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s;
        }
        header.scrolled {
          border-bottom-color: var(--color-border);
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-inner ul {
          display: none;
        }
        @media(min-width: 768px) {
          .nav-inner ul {
            display: flex;
            gap: 32px;
            list-style: none;
            margin: 0;
            padding: 0;
          }
        }
        .nav-inner ul a {
          color: var(--color-text-sec);
          font-weight: 500;
          position: relative;
          text-decoration: none;
          transition: color 0.25s;
        }
        .nav-inner ul a:hover {
          color: var(--color-text);
        }
        .nav-inner ul a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-primary);
          transition: width 0.25s ease;
        }
        .nav-inner ul a:hover::after {
          width: 100%;
        }
        .nav-ctas {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nav-ctas a {
          font-weight: 500;
          color: var(--color-text);
          text-decoration: none;
        }
        .btn-fill {
          background: var(--color-primary);
          color: white !important;
          padding: 10px 20px;
          border-radius: 8px;
          transition: background 0.2s, transform 0.2s;
        }
        .btn-fill:hover {
          background: var(--color-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(79,70,229,0.25);
        }

        /* Animations */
        [data-animate] {
          will-change: transform, opacity;
        }
        [data-animate="fade-up"] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-animate="fade-scale"] {
          opacity: 0;
          transform: scale(0.96) translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-animate="slide-in"] {
          opacity: 0;
          transform: translateX(-16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        [data-animate="mockup-reveal"] {
          opacity: 0;
          transform: scale(0.98) translateY(40px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .is-visible {
          opacity: 1 !important;
          transform: none !important;
        }

        /* Hero */
        .hero-section {
          position: relative;
          padding: 160px 24px 80px;
          text-align: center;
          overflow: hidden;
        }
        .parallax-layer {
          position: absolute;
          pointer-events: none;
        }
        #layer-1 {
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.04);
          filter: blur(60px);
          top: 0;
          right: 0;
        }
        #layer-2 {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.06);
          filter: blur(40px);
          bottom: 100px;
          left: 0;
        }
        #layer-dots {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.3;
        }
        
        .float-el {
          position: absolute;
          pointer-events: none;
          opacity: 0.1;
        }
        .float-el--1 {
          width: 40px; height: 40px; border-radius: 8px; border: 2px solid var(--color-primary);
          top: 20%; left: 15%;
          animation: float1 6s ease-in-out infinite;
        }
        .float-el--2 {
          width: 24px; height: 24px; border-radius: 50%; background: var(--color-primary);
          top: 30%; right: 20%;
          animation: float2 12s linear infinite;
        }
        .float-el--3 {
          width: 60px; height: 60px; border: 2px dashed var(--color-primary); border-radius: 50%;
          bottom: 20%; left: 25%;
          animation: float3 8s ease-in-out infinite alternate;
        }
        @keyframes float1 { 0%, 100% { transform: translateY(-20px); } 50% { transform: translateY(20px); } }
        @keyframes float2 { 0% { transform: rotate(0deg) translateY(0); } 100% { transform: rotate(360deg) translateY(-20px); } }
        @keyframes float3 { 0% { transform: translateX(10px) translateY(15px); } 100% { transform: translateX(-10px) translateY(-15px); } }

        .hero-inner {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid var(--color-border);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-sec);
          margin-bottom: 32px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .badge-dot {
          width: 6px;
          height: 6px;
          background: var(--color-primary);
          border-radius: 50%;
          position: relative;
        }
        .badge-dot::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: var(--color-primary);
          border-radius: 50%;
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }

        h1 {
          font-family: var(--font-lora), serif;
          font-size: 2.5rem;
          line-height: 1.2;
          color: var(--color-text);
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        @media(min-width: 768px) { h1 { font-size: 4rem; } }
        h1 em {
          font-style: italic;
          color: var(--color-primary);
        }
        .hero-sub {
          font-size: 1.125rem;
          color: var(--color-text-sec);
          margin-bottom: 40px;
          max-width: 600px;
          margin-inline: auto;
          line-height: 1.6;
        }
        @media(min-width: 768px) { .hero-sub { font-size: 1.25rem; } }

        .hero-ctas {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          justify-content: center;
        }
        @media(min-width: 640px) {
          .hero-ctas { flex-direction: row; }
        }
        .btn-primary {
          background: var(--color-primary);
          color: white !important;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 14px 0 rgba(79,70,229,0.39);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79,70,229,0.4);
          background: var(--color-primary-hover);
        }
        .btn-primary:active {
          transform: translateY(0);
          scale: 0.98;
        }
        .btn-ghost {
          color: var(--color-text-sec);
          font-weight: 600;
          padding: 16px 24px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .btn-ghost:hover {
          color: var(--color-text);
        }

        .hero-proof {
          margin-top: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: var(--color-text-sec);
          font-size: 14px;
          text-align: left;
          line-height: 1.4;
        }
        .avatars {
          display: flex;
        }
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid white;
          margin-left: -12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }
        .avatar-circle:first-child { margin-left: 0; }
        .hero-proof strong { color: var(--color-text); font-weight: 500; }

        /* Mockup */
        .mockup-section {
          padding: 0 24px 80px;
          position: relative;
          z-index: 20;
        }
        .mockup-wrap {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .browser-chrome {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--color-border);
          background: white;
        }
        .chrome-dot {
          width: 12px; height: 12px; border-radius: 50%;
        }
        .chrome-dots-wrap {
          display: flex;
          gap: 8px;
        }
        .chrome-url-bar {
          flex: 1;
          max-width: 400px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 13px;
          color: var(--color-text-sec);
        }

        .mockup-body {
          padding: 32px;
          background: var(--color-surface);
          text-align: left;
        }
        .mockup-container {
          background: white;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--color-border);
        }
        .mockup-placeholder-img {
          width: 100%;
          border: 1px dashed #A5B4FC;
          background: var(--color-primary-light);
          border-radius: 12px;
          padding: 64px 24px;
          text-align: center;
          color: var(--color-primary);
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .mockup-title {
          font-size: 1.25rem;
          font-weight: 700;
          font-family: var(--font-lora), serif;
          font-style: italic;
          color: var(--color-text);
          margin-bottom: 12px;
        }
        .mockup-desc {
          color: var(--color-text-sec);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .mockup-btn {
          display: inline-flex;
          background: var(--color-primary);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
        }

        /* General Section Layout */
        .section-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px;
        }
        @media(min-width: 768px) { .section-inner { padding: 120px 24px; } }
        .eyebrow {
          color: var(--color-primary);
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }
        .section-inner h2 {
          font-family: var(--font-lora), serif;
          font-size: 2rem;
          color: var(--color-text);
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }
        @media(min-width: 768px) { .section-inner h2 { font-size: 3rem; } }
        .section-inner h2 em {
          font-style: italic;
          color: var(--color-primary);
        }
        .section-sub {
          font-size: 1.125rem;
          color: var(--color-text-sec);
          margin-bottom: 60px;
        }

        /* Cara Kerja */
        .steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          list-style: none;
          padding: 0;
          counter-reset: steps;
        }
        @media(min-width: 768px) { .steps-grid { grid-template-columns: repeat(3, 1fr); gap: 40px; } }
        .step-card {
          position: relative;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 24px;
          padding: 40px 32px;
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .step-card:hover {
          transform: translateY(-4px);
          border-color: #C7D2FE;
          box-shadow: 0 12px 24px rgba(0,0,0,0.04);
        }
        .step-card:hover .step-icon {
          transform: scale(1.1);
        }
        .step-num {
          position: absolute;
          top: 24px;
          right: 32px;
          font-family: var(--font-lora);
          font-size: 64px;
          font-weight: 700;
          color: rgba(79, 70, 229, 0.05);
          line-height: 1;
        }
        .step-icon {
          width: 56px;
          height: 56px;
          background: var(--color-highlight);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: transform 0.3s;
          font-size: 24px;
        }
        .step-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 12px;
        }
        .step-card p {
          color: var(--color-text-sec);
          line-height: 1.6;
        }

        /* Value Section */
        .value-section {
          background: white;
          border-top: 1px solid var(--color-border);
        }
        .value-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          padding: 0;
          list-style: none;
        }
        @media(min-width: 768px) {
          .value-grid { grid-template-columns: repeat(3, 1fr); }
          .value-card--featured { grid-column: span 3; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 40px; }
        }
        .value-card {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 24px;
          padding: 40px;
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .value-card:hover {
          transform: translateY(-4px);
          border-color: #C7D2FE;
          box-shadow: 0 12px 24px rgba(0,0,0,0.04);
        }
        .value-card--featured {
          background: var(--color-surface);
          border-color: transparent;
        }
        .value-eyebrow {
          color: var(--color-text-sec);
          font-weight: 500;
          margin-bottom: 12px;
        }
        .value-num {
          font-family: var(--font-lora);
          font-size: 4rem;
          line-height: 1;
          color: var(--color-primary);
          margin-bottom: 24px;
        }
        .value-num--small {
          font-size: 2.5rem;
        }
        .value-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 8px;
        }
        .value-card p {
          color: var(--color-text-sec);
          line-height: 1.6;
        }

        /* FAQ Section */
        .faq-section {
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
        }
        
        /* Testimonials Section */
        .testimonials-section {
          padding: 100px 0;
          background: white;
          border-top: 1px solid var(--color-border);
          overflow: hidden;
        }
        .testimonials-header {
          text-align: center;
          margin-bottom: 60px;
          padding: 0 24px;
        }
        .testimonials-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        @media(min-width: 768px) { .testimonials-header h2 { font-size: 3rem; } }
        .testimonials-header p {
          font-size: 1.125rem;
          color: var(--color-text-sec);
          max-width: 600px;
          margin: 0 auto;
        }
        .testimonials-slider-wrap {
          width: 100%;
          position: relative;
        }
        .testimonials-track {
          display: flex;
          gap: 24px;
          padding: 0 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .testimonials-track::-webkit-scrollbar {
          display: none;
        }
        .testimonial-card {
          flex: 0 0 calc(100vw - 48px);
          max-width: 400px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          padding: 32px;
          scroll-snap-align: center;
        }
        .t-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .t-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .t-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .t-author-info h4 {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--color-text);
          margin: 0;
          padding: 0;
        }
        .t-author-info p {
          font-size: 0.875rem;
          color: var(--color-text-sec);
          margin: 0;
          padding: 0;
        }
        .t-badge {
          background: var(--color-highlight);
          color: var(--color-primary);
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .t-stars {
          color: #FBBF24;
          font-size: 1.25rem;
          margin-bottom: 16px;
          display: flex;
          gap: 4px;
        }
        .t-quote {
          font-size: 1rem;
          color: var(--color-text-sec);
          line-height: 1.6;
        }
        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          margin-top: 60px;
        }
        .faq-item {
          border-bottom: 1px solid var(--color-border);
        }
        .faq-item dt button {
          width: 100%;
          text-align: left;
          padding: 24px 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .faq-item dt button::after {
          content: '+';
          font-size: 1.5rem;
          color: var(--color-text-sec);
          transition: transform 0.3s;
        }
        .faq-item dt button[aria-expanded="true"]::after {
          transform: rotate(45deg);
        }
        .faq-item dd {
          margin: 0;
          padding-bottom: 24px;
          color: var(--color-text-sec);
          line-height: 1.6;
          display: none;
        }
        .faq-item dd[hidden] {
          display: none;
        }
        .faq-item dd:not([hidden]) {
          display: block;
        }

        /* CTA Section */
        .cta-section {
          padding: 120px 24px;
          text-align: center;
        }
        .cta-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .cta-inner h2 {
          font-family: var(--font-lora);
          font-size: 2.5rem;
          color: var(--color-text);
          margin-bottom: 24px;
        }
        @media(min-width: 768px) { .cta-inner h2 { font-size: 3.5rem; } }
        .cta-inner h2 em {
          font-style: italic;
          color: var(--color-primary);
        }
        .cta-inner p {
          font-size: 1.125rem;
          color: var(--color-text-sec);
          margin-bottom: 40px;
        }
        .btn-primary--large {
          font-size: 18px;
          padding: 20px 40px;
        }
        .cta-chips {
          list-style: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-top: 40px;
          color: var(--color-text-sec);
          font-size: 14px;
          font-weight: 500;
        }
        .cta-chips li {
          background: var(--color-surface);
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid var(--color-border);
        }

        /* Footer */
        footer {
          background: white;
          border-top: 1px solid var(--color-border);
          padding: 80px 24px 40px;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        @media(min-width: 768px) {
          .footer-inner { flex-direction: row; justify-content: space-between; }
        }
        .footer-brand .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text);
          text-decoration: none;
          margin-bottom: 16px;
          display: inline-block;
        }
        .logo span { color: var(--color-primary); }
        .footer-brand p {
          color: var(--color-text-sec);
          max-width: 250px;
        }
        footer nav {
          display: flex;
          gap: 40px;
        }
        footer nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        footer nav a {
          color: var(--color-text-sec);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        footer nav a:hover {
          color: var(--color-text);
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 80px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
          text-align: center;
          color: var(--color-text-sec);
        }

        @media (prefers-reduced-motion: reduce) { 
          *, *::before, *::after { 
            animation-duration: 0.01ms !important; 
            transition-duration: 0.01ms !important; 
          } 
        }
      `}} />

      <a href="#main-content" className="skip-link">Langsung ke konten utama</a>

      <div id="scroll-progress" role="progressbar" aria-hidden="true" aria-valuemin={0} aria-valuemax={100}></div>

      <header role="banner" className={isScrolled ? 'scrolled' : ''}>
        <nav aria-label="Navigasi utama">
          <div className="nav-inner">
            <Link href="/" className="logo" aria-label="LynkSell — Halaman Utama">
              <span className="font-bold text-xl tracking-tight text-slate-900">Lynk<span style={{color: 'var(--color-primary)'}}>Sell</span></span>
            </Link>
             <ul role="list">
              <li><a href="#fitur">Fitur</a></li>
              <li><a href="#value">Harga</a></li>
              <li><a href="#faq">Tentang</a></li>
            </ul>
            <div className="nav-ctas">
              <Link href="/login">Masuk</Link>
              <Link href="/register" className="btn-fill">Daftar Gratis</Link>
            </div>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section aria-labelledby="hero-heading" className="hero-section">
          <div aria-hidden="true" className="parallax-layer" data-speed="0.15" id="layer-1"></div>
          <div aria-hidden="true" className="parallax-layer" data-speed="0.25" id="layer-2"></div>
          <div aria-hidden="true" className="parallax-layer" data-speed="0.35" id="layer-dots"></div>

          <div aria-hidden="true" className="float-el float-el--1"></div>
          <div aria-hidden="true" className="float-el float-el--2"></div>
          <div aria-hidden="true" className="float-el float-el--3"></div>

          <div className="hero-inner">
            <p className="badge" data-animate="fade-up" style={{transitionDelay: '0s'}}>
              <span className="badge-dot" aria-hidden="true"></span>
              <span style={{ color: "var(--color-primary)" }}>1.000+ seller aktif di seluruh Indonesia</span>
            </p>

            <h1 id="hero-heading" data-animate="fade-up" style={{transitionDelay: '0.1s'}}>
              Satu link.<br/>
              <em>Ribuan pembeli.</em><br/>
              Tanpa potongan.
            </h1>

            <p className="hero-sub" data-animate="fade-up" style={{transitionDelay: '0.2s'}}>
              Upload foto produk, AI langsung nulisin copywriting yang menjual. 
              Siap disebar ke IG, TikTok, dan WhatsApp dalam 30 detik.
            </p>

            <div className="hero-ctas" data-animate="fade-up" style={{transitionDelay: '0.3s'}}>
              <Link href="/register" className="btn-primary">Mulai Gratis &rarr;</Link>
              <Link href="/templates" className="btn-ghost" style={{ border: '1px solid var(--color-border)', borderRadius: '12px' }}>Lihat contoh halaman</Link>
            </div>

            <div className="hero-proof" data-animate="fade-up" style={{transitionDelay: '0.4s'}} aria-label="Testimoni pengguna LynkSell">
              <div className="avatars" aria-hidden="true">
                <div className="avatar-circle" style={{ background: '#BFDBFE', color: '#1D4ED8', borderColor: 'white' }}>AS</div>
                <div className="avatar-circle" style={{ background: '#A7F3D0', color: '#047857', borderColor: 'white' }}>RD</div>
                <div className="avatar-circle" style={{ background: '#FDE68A', color: '#B45309', borderColor: 'white' }}>NF</div>
                <div className="avatar-circle" style={{ background: '#E9D5FF', color: '#6B21A8', borderColor: 'white' }}>BW</div>
              </div>
              <p>Bergabung bersama 1.000+ seller<br/>
              konversi rata-rata meningkat 3× lipat</p>
            </div>
          </div>
        </section>

        <section id="contoh" aria-label="Contoh hasil halaman jualan LynkSell" className="mockup-section">
          <div className="mockup-wrap" data-animate="mockup-reveal">
            <div className="browser-chrome" aria-hidden="true">
              <div className="chrome-dots-wrap">
                <div className="chrome-dot red" style={{ background: '#FF5F56' }}></div>
                <div className="chrome-dot yellow" style={{ background: '#FFBD2E' }}></div>
                <div className="chrome-dot green" style={{ background: '#27C93F' }}></div>
              </div>
              <div className="chrome-url-bar">
                lynksell.id/p/serum-vitamin-c-asli
              </div>
            </div>
            <div className="mockup-body">
              <div className="mockup-container">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#f8fafc' }}>
                  <Image 
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" 
                    alt="Serum Vitamin C" 
                    fill 
                    style={{ objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="mockup-title">"Kulit Cerah Dalam 7 Hari — Atau Uang Kembali"</h3>
                <p className="mockup-desc">Serum Vitamin C 20% yang diformulasikan khusus untuk kulit tropis. Sudah dipakai 3.200+ pembeli dengan rating 4.9/5.</p>
                <div className="mockup-btn">Pesan Sekarang &rarr;</div>
              </div>
            </div>
          </div>
        </section>

        <section id="fitur" aria-labelledby="steps-heading" className="bg-white">
          <div className="section-inner">
            <p className="eyebrow" data-animate="slide-in">Cara kerja</p>
            <h2 id="steps-heading" data-animate="fade-up" style={{transitionDelay: '0.05s'}}>
              Dari foto ke <em>link jualan</em> dalam hitungan detik
            </h2>
            <p className="section-sub" data-animate="fade-up" style={{transitionDelay: '0.1s'}}>
              Tidak perlu keahlian desain atau nulis. Cukup foto, sisanya AI yang urus.
            </p>

            <ol className="steps-grid" role="list">
              <li className="step-card" data-animate="fade-scale" style={{transitionDelay: '0s'}}>
                <span className="step-num" aria-hidden="true">01</span>
                <div className="step-icon" aria-hidden="true">📸</div>
                <h3>Upload Foto Produk</h3>
                <p>Pilih foto terbaik produk kamu. Tidak perlu edit dulu — cukup foto yang jelas dan bersih.</p>
              </li>
              <li className="step-card" data-animate="fade-scale" style={{transitionDelay: '0.1s'}}>
                <span className="step-num" aria-hidden="true">02</span>
                <div className="step-icon" aria-hidden="true">✨</div>
                <h3>AI Nulisin Semuanya</h3>
                <p>Gemini AI langsung bikin headline, deskripsi manfaat, dan urgensi yang mendorong pembeli bertindak.</p>
              </li>
              <li className="step-card" data-animate="fade-scale" style={{transitionDelay: '0.2s'}}>
                <span className="step-num" aria-hidden="true">03</span>
                <div className="step-icon" aria-hidden="true">🚀</div>
                <h3>Sebar & Mulai Jualan</h3>
                <p>Dapat link unik siap tempel di bio Instagram, TikTok, atau broadcast WhatsApp kamu.</p>
              </li>
            </ol>
          </div>
        </section>

        <section id="value" aria-labelledby="value-heading" className="value-section">
          <div className="section-inner">
            <p className="eyebrow" data-animate="slide-in">Kenapa LynkSell</p>
            <h2 id="value-heading" data-animate="fade-up" style={{transitionDelay: '0.05s'}}>
              Jualan lebih bebas, <em>keuntungan lebih besar</em>
            </h2>

            <ul className="value-grid" role="list">
              <li className="value-card" data-animate="fade-scale" style={{transitionDelay: '0s'}}>
                <p className="value-eyebrow">POTONGAN MARKETPLACE</p>
                <p className="value-num" data-count="0" data-suffix="%">0%</p>
                <h3>Bebas komisi platform</h3>
                <p>Semua hasil penjualan langsung masuk ke rekening kamu. Tanpa potongan admin, tanpa biaya iklan paksa.</p>
              </li>
              <li className="value-card" data-animate="fade-scale" style={{transitionDelay: '0.1s'}}>
                <p className="value-eyebrow">KECEPATAN SETUP</p>
                <p className="value-num" data-count="30" data-suffix=" dtk">30<span style={{ fontSize: '2rem', color: 'var(--color-text-sec)', marginLeft: '8px' }}>dtk</span></p>
                <h3>Dari foto ke halaman jualan</h3>
                <p>Lebih cepat dari nulis caption Instagram. Serius — kamu bisa langsung sebar dalam hitungan detik.</p>
              </li>
              <li className="value-card" data-animate="fade-scale" style={{transitionDelay: '0.15s'}}>
                <p className="value-eyebrow">KEPEMILIKAN</p>
                <p className="value-num" data-count="100" data-suffix="%">100%</p>
                <h3>Milik kamu sepenuhnya</h3>
                <p>Tidak bergantung platform marketplace. Tidak ada risiko akun disuspend atau toko dihapus tiba-tiba.</p>
              </li>
              <li className="value-card" data-animate="fade-scale" style={{transitionDelay: '0.25s'}}>
                <p className="value-eyebrow">COCOK UNTUK</p>
                <p className="value-num" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>UMKM <span style={{ fontSize: '2.5rem' }}>🇮🇩</span></p>
                <h3>Seller Indonesia banget</h3>
                <p>Dirancang khusus untuk seller yang aktif di WhatsApp, Instagram, dan TikTok. Langsung jalan, tidak ribet.</p>
              </li>
            </ul>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-heading" className="faq-section">
          <div className="section-inner text-center">
            <p className="eyebrow" data-animate="slide-in">Pertanyaan umum</p>
            <h2 id="faq-heading" data-animate="fade-up">Ada yang ingin ditanyakan?</h2>

            <dl className="faq-list text-left">
              <div className="faq-item" data-animate="fade-up" style={{transitionDelay: '0s'}}>
                <dt>
                  <button aria-expanded={openFaq === 'faq1'} aria-controls="faq-1" onClick={() => toggleFaq('faq1')}>
                    Apa itu LynkSell?
                  </button>
                </dt>
                <dd id="faq-1" hidden={openFaq !== 'faq1'}>
                  LynkSell adalah tools AI yang membantu UMKM Indonesia membuat halaman 
                  jualan profesional hanya dari foto produk dalam 30 detik, tanpa potongan marketplace.
                </dd>
              </div>
              <div className="faq-item" data-animate="fade-up" style={{transitionDelay: '0.1s'}}>
                <dt>
                  <button aria-expanded={openFaq === 'faq2'} aria-controls="faq-2" onClick={() => toggleFaq('faq2')}>
                    Apakah LynkSell benar-benar gratis?
                  </button>
                </dt>
                <dd id="faq-2" hidden={openFaq !== 'faq2'}>
                  Ya. Kamu bisa mulai gratis tanpa kartu kredit dan tanpa potongan komisi 
                  dari semua hasil penjualan.
                </dd>
              </div>
              <div className="faq-item" data-animate="fade-up" style={{transitionDelay: '0.2s'}}>
                <dt>
                  <button aria-expanded={openFaq === 'faq3'} aria-controls="faq-3" onClick={() => toggleFaq('faq3')}>
                    Platform apa yang didukung?
                  </button>
                </dt>
                <dd id="faq-3" hidden={openFaq !== 'faq3'}>
                  Link jualan LynkSell bisa disebar di mana saja — bio Instagram, 
                  link TikTok, broadcast WhatsApp, atau bahkan dicetak sebagai QR code.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="testimonials-header" data-animate="fade-up">
            <h2>Seller yang sudah merasakan manfaatnya</h2>
            <p>Bergabunglah dengan ribuan UMKM yang sudah lebih dulu meraih penjualan tinggi tanpa potongan komisi.</p>
          </div>
          
          <div className="testimonials-slider-wrap" data-animate="fade-up" style={{transitionDelay: '0.1s'}}>
            <div className="testimonials-track">
              
              <div className="testimonial-card">
                <div className="t-card-header">
                  <div className="t-author">
                    <div className="t-avatar" style={{ background: '#BFDBFE', color: '#1D4ED8' }}>SR</div>
                    <div className="t-author-info">
                      <h4>Siti Rahma</h4>
                      <p>Bandung</p>
                    </div>
                  </div>
                  <div className="t-badge">Fashion</div>
                </div>
                <div className="t-stars">★ ★ ★ ★ ★</div>
                <p className="t-quote">
                  "Semenjak pakai LynkSell, saya nggak pernah mikirin potongan komisi lagi. Link-nya saya taruh di bio IG, pembeli langsung klik dan chat WA. Gampang banget!"
                </p>
              </div>

              <div className="testimonial-card">
                <div className="t-card-header">
                  <div className="t-author">
                    <div className="t-avatar" style={{ background: '#A7F3D0', color: '#047857' }}>BS</div>
                    <div className="t-author-info">
                      <h4>Budi Santoso</h4>
                      <p>Semarang</p>
                    </div>
                  </div>
                  <div className="t-badge">Kuliner</div>
                </div>
                <div className="t-stars">★ ★ ★ ★ ★</div>
                <p className="t-quote">
                  "Cuma modal foto risoles, AI-nya buatin kata-kata keren banget. Penjualan naik 30% bulan ini karena kelihatan lebih profesional."
                </p>
              </div>

              <div className="testimonial-card">
                <div className="t-card-header">
                  <div className="t-author">
                    <div className="t-avatar" style={{ background: '#FDE68A', color: '#B45309' }}>MS</div>
                    <div className="t-author-info">
                      <h4>Maya Sari</h4>
                      <p>Surabaya</p>
                    </div>
                  </div>
                  <div className="t-badge">Skincare</div>
                </div>
                <div className="t-stars">★ ★ ★ ★ ★</div>
                <p className="t-quote">
                  "Tadinya repot balasin chat satu-satu buat kasih deskripsi barang. Sekarang kasih aja link LynkSell, semua info lengkap di situ. Praktis!"
                </p>
              </div>

              <div className="testimonial-card">
                <div className="t-card-header">
                  <div className="t-author">
                    <div className="t-avatar" style={{ background: '#E9D5FF', color: '#6B21A8' }}>AF</div>
                    <div className="t-author-info">
                      <h4>Ahmad Fauzi</h4>
                      <p>Jakarta</p>
                    </div>
                  </div>
                  <div className="t-badge">Elektronik</div>
                </div>
                <div className="t-stars">★ ★ ★ ★ ★</div>
                <p className="t-quote">
                  "Setup-nya beneran cepat, nggak sampai semenit. Desain websitenya rapi dan bisa ditaruh di mana aja. Nyesel ga dari dulu pake ini!"
                </p>
              </div>

            </div>
          </div>
        </section>

        <section aria-labelledby="cta-heading" className="cta-section">
          <div className="cta-inner">
            <h2 id="cta-heading" data-animate="fade-up">
              Siap bikin <em>link jualan pertama</em> kamu?
            </h2>
            <p data-animate="fade-up" style={{transitionDelay: '0.1s'}}>
              Gratis tanpa syarat. Tidak perlu kartu kredit. Tidak ada komisi.
            </p>
            <div data-animate="fade-up" style={{transitionDelay: '0.2s'}}>
              <Link href="/register" className="btn-primary btn-primary--large inline-block">
                Mulai Gratis Sekarang &rarr;
              </Link>
            </div>
            <ul className="cta-chips" role="list" data-animate="fade-up" style={{transitionDelay: '0.3s'}}>
              <li>✓ Tanpa potongan komisi</li>
              <li>✓ Setup 30 detik</li>
              <li>✓ Powered by Gemini AI</li>
            </ul>
          </div>
        </section>

      </main>

      <footer role="contentinfo">
        <div className="footer-inner text-left">
          <div className="footer-brand">
            <Link href="/" className="logo" aria-label="LynkSell">
              <span className="font-bold tracking-tight text-slate-900">Lynk<span style={{color: 'var(--color-primary)'}}>Sell</span></span>
            </Link>
            <p>Satu link. Ribuan pembeli. Tanpa marketplace.</p>
          </div>

          <nav aria-label="Navigasi footer">
            <h3 className="sr-only">Tautan halaman</h3>
            <ul role="list">
              <li><Link href="#fitur">Fitur</Link></li>
              <li><Link href="#value">Keunggulan</Link></li>
              <li><Link href="#faq">FAQ</Link></li>
            </ul>
            <ul role="list">
              <li><Link href="/terms">Syarat & Ketentuan</Link></li>
              <li><Link href="/privacy">Kebijakan Privasi</Link></li>
              <li><Link href="/contact">Kontak</Link></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>
            <small>© {new Date().getFullYear()} LynkSell. Dibuat dengan ❤️ untuk UMKM Indonesia.</small>
          </p>
        </div>
      </footer>
    </>
  );
}
