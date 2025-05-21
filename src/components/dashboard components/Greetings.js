import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaCoffee, FaStar, FaRegSmile, FaRegLightbulb,FaRegCalendarAlt} from 'react-icons/fa';

const RandomGreeting = ({ userName = 'User' }) => {
    const [greeting, setGreeting] = useState(`Hello, ${userName}`);
    const [icon, setIcon] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Get current hour
        const hour = new Date().getHours();
        
        // Time-based greetings with corresponding icons
        let timeBasedGreetings = [];
        
        if (hour >= 5 && hour < 12) {
            timeBasedGreetings.push({ 
                text: `🌄Good Morning, ${userName}`, 
                icon: <FaSun size={18} style={{ color: '#8b1e41' }} /> 
            });
            timeBasedGreetings.push({ 
                text: `🌄Mayong aga simo, ${userName}`, 
                icon: <FaSun size={18} style={{ color: '#8b1e41' }} /> 
            });
            timeBasedGreetings.push({ 
                text: `🌅Rise and Shine, ${userName}`, 
                icon: <FaCoffee size={18} style={{ color: '#8b1e41' }} /> 
            });
            timeBasedGreetings.push({ 
                text: `Early today, ${userName}`, 
                icon: <FaCoffee size={18} style={{ color: '#8b1e41' }} /> 
            });
            timeBasedGreetings.push({ 
                text: `Have you had your coffee, ${userName}?`, 
                icon: <FaCoffee size={18} style={{ color: '#8b1e41' }} /> 
            });
        } else if (hour >= 12 && hour < 18) {
            timeBasedGreetings.push({ 
                text: `Good Afternoon, ${userName}`, 
                icon: <FaSun size={18} style={{ color: '#8b1e41' }} /> 
            });
            timeBasedGreetings.push({ 
                text: `Having a good day, ${userName}?`, 
                icon: <FaRegSmile size={18} style={{ color: '#8b1e41' }} /> 
            });
        } else {
            timeBasedGreetings.push({ 
                text: `Good Evening, ${userName}`, 
                icon: <FaMoon size={18} style={{ color: '#8b1e41' }} /> 
            });
            timeBasedGreetings.push({ 
                text: `Winding down, ${userName}?`, 
                icon: <FaRegLightbulb size={18} style={{ color: '#8b1e41' }} /> 
            });
            timeBasedGreetings.push({ 
                text: `Kaya Pa, ${userName}?`, 
                icon: <FaRegLightbulb size={18} style={{ color: '#8b1e41' }} /> 
            });
        }
        
        // General greetings with icons
        const generalGreetings = [
            { 
                text: `Welcome back, ${userName}`, 
                icon: <FaRegCalendarAlt size={18} style={{ color: '#8b1e41' }} /> 
            },
            { 
                text: `Hello, ${userName}`, 
                icon: <FaRegSmile size={18} style={{ color: '#8b1e41' }} /> 
            },
            { 
                text: `Greetings, ${userName}`, 
                icon: <FaStar size={18} style={{ color: '#8b1e41' }} /> 
            },
            { 
                text: `Nice to see you, ${userName}`, 
                icon: <FaRegSmile size={18} style={{ color: '#8b1e41' }} /> 
            },
            { 
                text: `Back at it, ${userName}`, 
                icon: <FaRegSmile size={18} style={{ color: '#8b1e41' }} /> 
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
        setIcon(selectedGreeting.icon);
        
        // Add a small delay before showing the greeting for a fade-in effect
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [userName]);

    return (
         <div className="greeting-container">
            <div className="greeting-wrapper">
                {/* {icon && (
                    <div className={`icon-container ${isVisible ? 'fade-in' : 'fade-out'}`}>
                        {icon}
                    </div>
                )} */}
                <h2 className={`greeting-text ${isVisible ? 'fade-in' : 'fade-out'}`}>
                    {greeting}
                </h2>
            </div>
            
            {/*  gradient line
            <div className="absolute bottom-0 left-0 w-full">
                <div className={`gradient-line ${isVisible ? 'scale-x-100' : 'scale-x-0'}`}></div>
            </div>
            */}
        </div>
    );
};

export default RandomGreeting;