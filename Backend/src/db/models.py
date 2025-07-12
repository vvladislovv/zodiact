from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    telegram_name = Column(String, nullable=False)
    subscription_status = Column(String, default="inactive")
    subscription_expires = Column(DateTime, nullable=True)
    joined = Column(DateTime, default=datetime.utcnow)
    points = Column(Integer, default=0)
    referred_by = Column(String, nullable=True)
    
    tarot_history = relationship("TarotHistory", back_populates="user")
    coffee_history = relationship("CoffeeHistory", back_populates="user")
    feedback = relationship("Feedback", back_populates="user")

class TarotHistory(Base):
    __tablename__ = "tarot_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    question = Column(Text, nullable=False)
    cards = Column(Text, nullable=False)  # Store as comma-separated string
    summary = Column(Text, nullable=False)
    
    user = relationship("User", back_populates="tarot_history")

class CoffeeHistory(Base):
    __tablename__ = "coffee_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_id = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    result_text = Column(Text, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="coffee_history")

class InfoPage(Base):
    __tablename__ = "info_pages"
    
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    text = Column(Text, nullable=False)

class CardMeaning(Base):
    __tablename__ = "card_meanings"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    positive = Column(Text, nullable=False)
    negative = Column(Text, nullable=False)

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="feedback")

class Log(Base):
    __tablename__ = "logs"
    
    id = Column(Integer, primary_key=True, index=True)
    level = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
