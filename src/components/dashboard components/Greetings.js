import React, { useState, useEffect } from 'react';

const RandomGreeting = ({ userName = 'User' }) => {
    const [greeting, setGreeting] = useState(`Hello, ${userName}`);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Get current hour
        const hour = new Date().getHours();
        
        // Time-based greetings with corresponding icons
        let timeBasedGreetings = [];
        
        if (hour >= 5 && hour < 12) {
            timeBasedGreetings.push({ 
                text: `🌄Good Morning, ${userName}!`, 
            });
            timeBasedGreetings.push({ 
                text: `🌄Mayong aga simo, ${userName}!`, 
            });
            timeBasedGreetings.push({ 
                text: `🌅Rise and Shine, ${userName}!`, 
            });
            timeBasedGreetings.push({ 
                text: `😴Early today, ${userName}`, 
            });
            timeBasedGreetings.push({ 
                text: `☕Have you had your coffee, ${userName}?`, 
            });
        } else if (hour >= 12 && hour < 18) {
            timeBasedGreetings.push({ 
                text: `😊Good Afternoon, ${userName}!`, 
            });
            timeBasedGreetings.push({ 
                text: `😉Having a good day, ${userName}?`, 
            });
            timeBasedGreetings.push({ 
                text: `🙂Everything alright, ${userName}?`, 
            });
            timeBasedGreetings.push({ 
                text: `😊How's your afternoon going, ${userName}?`, 
            });
            timeBasedGreetings.push({ 
                text: `☺️Wishing you a smooth and successful afternoon, ${userName}`, 
            });
        } else {
            timeBasedGreetings.push({ 
                text: `🌃Good Evening, ${userName}`, 
            });
            timeBasedGreetings.push({ 
                text: `🥱Winding down, ${userName}?`, 
            });
            timeBasedGreetings.push({ 
                text: `💪Kaya Pa ${userName}?`, 
            });
            timeBasedGreetings.push({ 
                text: `☺️Hello! How was your day ${userName}?`, 
            });
            timeBasedGreetings.push({ 
                text: `🤗Wishing you a peaceful and restful evening, ${userName}`, 
            });
        }
        
        // General greetings with icons
        const generalGreetings = [
            { 
                text: `Welcome back, ${userName}`, 
            },
            { 
                text: `Hello, ${userName}`, 
            },
            { 
                text: `Greetings, ${userName}`, 
            },
            { 
                text: `Nice to see you, ${userName}`, 
            },
            { 
                text: `Back at it, ${userName}`, 
            }
        ];
        
        // Combine time-based and general greetings
        // Giving time-based greetings higher chance (70%) of being selected
        const shouldUseTimeBased = Math.random() < 0.7;
        
        let selectedGreeting;
        if (shouldUseTimeBased && timeBasedGreetings.length > 0) {
            const randomIndex = Math.floor(Math.random() * timeBasedGreetings.length);
            selectedGreeting = timeBasedGreetings[randomIndex];
        } else {
            const randomIndex = Math.floor(Math.random() * generalGreetings.length);
            selectedGreeting = generalGreetings[randomIndex];
        }
        
        setGreeting(selectedGreeting.text);
        
        // Add a small delay before showing the greeting for a fade-in effect
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [userName]);

    return (
         <div className="greeting-container">
            <div className="greeting-wrapper">
                <h2 className={`greeting-text ${isVisible ? 'fade-in' : 'fade-out'}`}>
                    {greeting}
                </h2>
            </div>            
        </div>
    );
};

export default RandomGreeting;