'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const GIFS = {
  shy: '/cat-shy.gif',
  sad1: '/cat-sad1.gif',
  sad2: '/cat-sad2.gif',
  angry: '/cat-angry.gif',
  happy: '/cat-happy.gif',
  celebration: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjg2OHFuYjBpcmR1bnhta3R3eXlzbmluNXgzcWtkcmtncHd4YWZ1ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XaikVL6qbrJSJoQmCR/giphy.gif'
};

const PHRASES = {
  initial: "I have a really important question for you...",
  persuasive: [
    "I promise I'll always be there for you.",
    "Think of all the adventures we could have!",
    "We'd be perfect together, don't you think?",
    "Okay, trying to make it a bit harder now!",
    "Are you *sure* sure?",
    "This is your final final chance! Please? 🥺"
  ],
  hover: [
    "Hey! Stop chasing me!",
    "Catch me if you can! 😉",
    "Don't you give up?",
    "You're persistent!",
    "Haha, almost!"
  ],
  celebrations: [
    "YESSSS!!! 🎉 You're amazing!",
    "This is the best day ever! 💖",
    "I knew you'd say yes! 😍",
    "Let's make wonderful memories together! 🌟"
  ]
};

export default function ProposalPage() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [noButtonStyle, setNoButtonStyle] = useState({});
  const [showHoverMessage, setShowHoverMessage] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const hoverMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const MOVEMENT_THRESHOLD = 4;
  const yesButtonSize = Math.min(3, 1 + noCount * 0.2);

  useEffect(() => {
    // Set random celebration message when yes is pressed
    if (yesPressed) {
      setCelebrationMessage(
        PHRASES.celebrations[Math.floor(Math.random() * PHRASES.celebrations.length)]
      );
    }
  }, [yesPressed]);

  useEffect(() => {
    return () => {
      if (hoverMessageTimeoutRef.current) {
        clearTimeout(hoverMessageTimeoutRef.current);
      }
    };
  }, []);

  const handleNoClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isAnimating) return;
    
    const newNoCount = noCount + 1;
    setNoCount(newNoCount);
    
    if (newNoCount >= MOVEMENT_THRESHOLD) {
      moveNoButton();
    }
  };

  const moveNoButton = () => {
    if (typeof window === 'undefined' || !noButtonRef.current) return;

    setIsAnimating(true);
    
    const button = noButtonRef.current;
    const buttonRect = button.getBoundingClientRect();
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    const maxX = vw - buttonRect.width - 20;
    const maxY = vh - buttonRect.height - 20;

    const newX = Math.max(20, Math.random() * maxX);
    const newY = Math.max(20, Math.random() * maxY);

    setNoButtonStyle({
      position: 'absolute',
      left: `${newX}px`,
      top: `${newY}px`,
      transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
    });

    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleNoMouseEnter = () => {
    if (noCount < MOVEMENT_THRESHOLD || isAnimating) return;

    moveNoButton();
    
    setShowHoverMessage(true);
    if (hoverMessageTimeoutRef.current) {
      clearTimeout(hoverMessageTimeoutRef.current);
    }
    
    hoverMessageTimeoutRef.current = setTimeout(() => {
      setShowHoverMessage(false);
    }, 1500);
  };

  const getHeadingText = () => {
    if (showHoverMessage) {
      return PHRASES.hover[Math.floor(Math.random() * PHRASES.hover.length)];
    }
    return noCount === 0 
      ? PHRASES.initial 
      : PHRASES.persuasive[Math.min(noCount - 1, PHRASES.persuasive.length - 1)];
  };

  const getCurrentGif = () => {
    if (yesPressed) return GIFS.celebration;
    if (noCount === 0) return GIFS.shy;
    if (noCount === 1) return GIFS.sad1;
    if (noCount === 2) return GIFS.sad2;
    return GIFS.angry;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 relative overflow-hidden text-white">
      {yesPressed ? (
        <div className="text-center animate-fade-in max-w-2xl">
          <div className="relative h-64 w-full mb-8 mx-auto">
            <Image 
              src={GIFS.celebration} 
              alt="Happy Celebrating Cat" 
              fill
              className="object-contain rounded-lg"
              unoptimized
              priority
            />
          </div>
          <div className="text-5xl font-extrabold p-4 rounded-lg shadow-lg bg-white text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 animate-pulse">
            {celebrationMessage}
          </div>
          <p className="mt-6 text-2xl font-semibold text-gray-100">
            You just made me the happiest person! 🥰
          </p>
          <p className="mt-10 text-lg font-medium text-gray-200">
            Crafted with love by your Secret Admirer
          </p>
        </div>
      ) : (
        <div className="text-center w-full max-w-md">
          <div className="relative h-48 w-48 mb-6 mx-auto">
            <Image
              src={getCurrentGif()}
              alt="Cat reaction based on clicks"
              fill
              className="object-contain transition-opacity duration-500"
              unoptimized
            />
          </div>

          <div className="text-center min-h-[100px]">
            <h1 className="text-3xl font-semibold mb-4 text-gray-100 drop-shadow-md px-4 transition-all duration-300">
              {getHeadingText()}
            </h1>
            <h2 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-300 drop-shadow-lg">
              Disha, will you be mine?
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full px-4 sm:px-0">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-all duration-300 ease-in-out border-2 border-white hover:scale-105 active:scale-95"
              style={{ transform: `scale(${yesButtonSize})` }}
              onClick={() => setYesPressed(true)}
            >
              Absolutely Yes!
            </button>
            <button
              ref={noButtonRef}
              className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-xl border-2 border-white transition-all ${noCount >= MOVEMENT_THRESHOLD ? 'cursor-none' : ''}`}
              style={noCount >= MOVEMENT_THRESHOLD ? noButtonStyle : {}}
              onClick={handleNoClick}
              onMouseEnter={handleNoMouseEnter}
            >
              {noCount === 0 ? 'No' : 'Still No?'}
            </button>
          </div>

          <p className="text-center mt-16 text-xl font-semibold text-gray-200 opacity-90">
            ~ Secret Admirer
          </p>
        </div>
      )}
    </main>
  );
}