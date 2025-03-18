"use client"


"use client"


import { 
  ShoppingCart, 
  Trash2, 
  CreditCard,
  User,

  Mail,
  Plus,
  Minus,
  Info,

} from 'lucide-react';

// Create the OrderManagementSystem component
const OrderManagementSystem = () => {
  // State for cart, customer info and UI control
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('menu'); // menu, details, payment
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    tableNumber: '',
    specialInstructions: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // State for restaurant menu items - using the existing restaurant data
  const [menuItems] = useState(restaurantData.foods);
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Add item to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Otherwise add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  // Handle customer info changes
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Proceed to next step
  const proceedToDetails = () => {
    if (cart.length === 0) {
      alert('Please add items to your order before continuing.');
      return;
    }
    setCurrentStep('details');
  };
  
  const proceedToPayment = () => {
    // Basic validation
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.tableNumber) {
      alert('Please fill in all required fields before continuing.');
      return;
    }
    setCurrentStep('payment');
  };
  
  // Place order function
  const placeOrder = () => {
    // Generate random order number
    const newOrderNumber = 'BS' + Math.floor(1000 + Math.random() * 9000);
    setOrderNumber(newOrderNumber);
    
    // In a real application, you'd send this data to your backend
    const orderData = {
      orderNumber: newOrderNumber,
      customer: customerInfo,
      items: cart,
      total: cartTotal,
      orderTime: new Date().toISOString(),
      status: 'Preparing'
    };
    
    console.log('Order placed:', orderData);
    
    // Show success state
    setOrderPlaced(true);
    
    // Reset cart
    setCart([]);
  };
  
  // Reset order flow
  const startNewOrder = () => {
    setCurrentStep('menu');
    setOrderPlaced(false);
    setCustomerInfo({
      name: '',
      phone: '',
      email: '',
      tableNumber: '',
      specialInstructions: ''
    });
  };
  
  // Order summary component
  const OrderSummary = () => (
    <div className="bg-orange-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
      <div className="space-y-2">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>{item.quantity} × {item.name}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-orange-200 mt-3 pt-3 flex justify-between font-semibold">
        <span>Total</span>
        <span>₹{cartTotal.toFixed(2)}</span>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Cart toggle button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300"
        aria-label="Open cart"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-white text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </div>
          )}
        </div>
      </button>
      
      {/* Cart/Order sidebar */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {currentStep === 'menu' && 'Your Order'}
            {currentStep === 'details' && 'Customer Details'}
            {currentStep === 'payment' && 'Payment'}
            {orderPlaced && 'Order Confirmed'}
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {orderPlaced ? (
            // Order confirmation
            <div className="text-center py-8">
              <div className="bg-green-100 text-green-800 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Order Confirmed!</h3>
              <p className="text-gray-600 mb-4">Your order #{orderNumber} has been placed successfully.</p>
              <p className="mb-6">Our staff will start preparing your food right away.</p>
              <OrderSummary />
              <button
                onClick={startNewOrder}
                className="mt-6 bg-orange-600 text-white w-full py-3 rounded-lg hover:bg-orange-700"
              >
                Place New Order
              </button>
            </div>
          ) : currentStep === 'menu' ? (
            // Cart items
            cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add items from the menu to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex border-b pb-4">
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-gray-500 text-sm">{item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-500 hover:text-orange-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-500 hover:text-orange-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-3 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-right text-lg font-semibold">
                  Total: ₹{cartTotal.toFixed(2)}
                </div>
              </div>
            )
          ) : currentStep === 'details' ? (
            // Customer details form
            <div className="space-y-4">
              <OrderSummary />
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
                    <div className="mt-1 relative">
                      <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInfoChange}
                        className="pl-10 py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                    <div className="mt-1 relative">
                      <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInfoChange}
                        className="pl-10 py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 relative">
                      <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInfoChange}
                        className="pl-10 py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">Table Number *</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="tableNumber"
                        name="tableNumber"
                        value={customerInfo.tableNumber}
                        onChange={handleInfoChange}
                        className="py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">Special Instructions</label>
                    <div className="mt-1">
                      <textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        rows="3"
                        value={customerInfo.specialInstructions}
                        onChange={handleInfoChange}
                        className="py-2 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        placeholder="Any allergies or special requests?"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Payment options
            <div className="space-y-6">
              <OrderSummary />
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-3">Customer Info</h3>
                <div className="text-gray-700">
                  <p><span className="font-medium">Name:</span> {customerInfo.name}</p>
                  <p><span className="font-medium">Phone:</span> {customerInfo.phone}</p>
                  <p><span className="font-medium">Table:</span> {customerInfo.tableNumber}</p>
                  {customerInfo.email && <p><span className="font-medium">Email:</span> {customerInfo.email}</p>}
                  {customerInfo.specialInstructions && (
                    <div className="mt-2">
                      <p className="font-medium">Special Instructions:</p>
                      <p className="text-gray-600 text-sm">{customerInfo.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-3">Payment Method</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border rounded-lg bg-gray-50">
                    <input
                      type="radio"
                      id="payAtTable"
                      name="paymentMethod"
                      defaultChecked
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="payAtTable" className="ml-3 block text-gray-700">
                      Pay at table
                    </label>
                  </div>
                  <div className="flex items-center p-3 border rounded-lg">
                    <input
                      type="radio"
                      id="payOnline"
                      name="paymentMethod"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="payOnline" className="ml-3 block text-gray-700">
                      Online payment
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with actions */}
        {!orderPlaced && (
          <div className="p-4 border-t">
            {currentStep === 'menu' && cart.length > 0 && (
              <button
                onClick={proceedToDetails}
                className="bg-orange-600 text-white w-full py-3 rounded-lg hover:bg-orange-700"
              >
                Continue to Details
              </button>
            )}
            
            {currentStep === 'details' && (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={proceedToPayment}
                  className="bg-orange-600 text-white w-full py-3 rounded-lg hover:bg-orange-700"
                >
                  Continue to Payment
                </button>
                <button
                  onClick={() => setCurrentStep('menu')}
                  className="text-gray-600 w-full py-2 hover:text-orange-600"
                >
                  Back to Cart
                </button>
              </div>
            )}
            
            {currentStep === 'payment' && (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={placeOrder}
                  className="bg-orange-600 text-white w-full py-3 rounded-lg hover:bg-orange-700 flex items-center justify-center"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Place Order (₹{cartTotal.toFixed(2)})
                </button>
                <button
                  onClick={() => setCurrentStep('details')}
                  className="text-gray-600 w-full py-2 hover:text-orange-600"
                >
                  Back to Details
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Menu Section with Add to Cart buttons */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Order Menu</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuItems.map((food) => (
              <div key={food.id} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100">
                <div className="relative">
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-orange-600 text-white px-3 py-1 text-sm rounded-bl-lg">
                    {food.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{food.name}</h3>
                  <p className="text-gray-600 mb-4">{food.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-orange-600 font-bold">₹{food.price}</p>
                    <button 
                      onClick={() => {
                        addToCart(food);
                        if (!isCartOpen) setIsCartOpen(true);
                      }}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Order
                    </button>
                  </div>
                  
                  {/* Show if item is in cart */}
                  {cart.find(item => item.id === food.id) && (
                    <div className="mt-3 text-sm text-green-600 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      {cart.find(item => item.id === food.id).quantity} in your order
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}; 


import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';


// Add this component to your existing code
const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chatbot iframe container */}
      <div 
        className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{
          width: 'calc(100% - 2rem)',
          maxWidth: '450px',
          height: '650px',
          maxHeight: 'calc(100vh - 6rem)'
        }}
      >
        <div className="flex justify-between items-center bg-orange-600 text-white p-3 rounded-t-lg">
          <h3 className="font-medium">Bangalore Spice Assistant</h3>
          <button 
            onClick={toggleChatbot}
            className="text-white hover:text-gray-200"
            aria-label="Close chatbot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <iframe
          src="http://localhost:3000/chatbot_iframe"
          className="w-full h-full rounded-b-lg"
          style={{ height: 'calc(100% - 45px)' }}
          title="Bangalore Spice Chatbot"
        ></iframe>
      </div>
    </>
  );
};


// import React from 'react';
// import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter,
  Menu as MenuIcon,
  ChevronDown,
  ChevronUp,
  Star,
  Gift,
  Award
} from 'lucide-react';

// Enhanced restaurant data
const restaurantData = {
  foods: [
    {
      id: 1,
      name: "Butter Chicken",
      description: "Creamy, rich tomato-based curry with tender chicken pieces",
      price: 499,
      image: "/images/butter-chicken.jpg",
      category: "Main Course"
    },
    {
      id: 2,  
      name: "Biryani",
      description: "Fragrant rice dish with aromatic spices and tender meat",
      price: 449,
      image: "/images/biryani.jpg",
      category: "Main Course"
    },
    {
      id: 3,
      name: "Paneer Tikka",
      description: "Grilled cottage cheese with spicy marinade",
      price: 399,
      image: "/images/paneer-tikka.jpg",
      category: "Starters"
    },
    {
      id: 4,
      name: "Masala Dosa",
      description: "Crispy rice crepe filled with spiced potato filling, served with sambar and chutney",
      price: 249,
      image: "/images/masala-dosa.jpg",
      category: "South Indian"
    },
    {
      id: 5,
      name: "Tandoori Chicken",
      description: "Juicy chicken marinated in yogurt and spices, cooked in a tandoor",
      price: 449,
      image: "https://healthyfitnessmeals.com/wp-content/uploads/2020/11/Tandoori-chicken-6.jpg", // Updated image
      category: "Starters"
    },
    {
      id: 6,
      name: "Palak Paneer",
      description: "Cottage cheese cubes in a creamy spinach gravy",
      price: 379,
      image: "https://s3.amazonaws.com/images.chefinyou.com/main/opos-palak-paneer-recipe/main-img4.JPG ",
      category: "Main Course"
    },

  ],
  specialOffers: [
    {
      id: 1,
      title: "Weekend Special",
      description: "20% off on family platters",
    },
    {
      id: 2,
      title: "Happy Hours",
      description: "Buy 1 Get 1 on mocktails (2 PM - 5 PM)",
    },
    {
      id: 3,
      title: "Festival Thali",
      description: "Limited time festive thali with 12 delicacies for ₹699 only",
    },
    {
      id: 4,
      title: "Corporate Lunch",
      description: "Special 15% discount for corporate lunch bookings",
    }
  ],
  reviews: [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      comment: "The butter chicken was absolutely divine! Authentic flavors that reminded me of home.",
      date: "March 5, 2025"
    },
    {
      id: 2,
      name: "Rahul Verma",
      rating: 4,
      comment: "Great ambiance and excellent service. The biryani portion size could be a bit larger.",
      date: "February 24, 2025"
    },
    {
      id: 3,
      name: "Aisha Khan",
      rating: 5,
      comment: "Best South Indian food I've had in Bangalore! The masala dosa was crispy and flavorful.",
      date: "March 10, 2025"
    }
  ],
  chefs: [
    {
      id: 1,
      name: "Chef Rajesh Kumar",
      position: "Head Chef",
      expertise: "North Indian Cuisine",
      experience: "15+ years",
      image: "/images/chef-rajesh.jpg"
    },
    {
      id: 2,
      name: "Chef Lakshmi Nair",
      position: "Pastry Chef",
      expertise: "Desserts & Fusion Sweets",
      experience: "12 years",
      image: "/images/chef-lakshmi.jpg"
    }
  ],
  faqs: [
    {
      id: 1,
      question: "Do you take advance reservations?",
      answer: "Yes, we recommend making a reservation, especially for weekends. You can book a table online or call us at +91 98765 43210."
    },
    {
      id: 2,
      question: "Do you offer vegetarian options?",
      answer: "Absolutely! We have an extensive menu of vegetarian dishes including paneer specialties, vegetable curries, and South Indian delicacies."
    },
    {
      id: 3,
      question: "Is there a parking facility available?",
      answer: "Yes, we have complimentary valet parking for our guests. There's also a public parking lot within 100 meters of our restaurant."
    },
    {
      id: 4,
      question: "Do you cater for private events?",
      answer: "Yes, we offer catering services for private events, parties, and corporate functions. Please contact us for a customized menu."
    },
    {
      id: 5,
      question: "Are there any gluten-free options?",
      answer: "We have several gluten-free dishes on our menu. Please inform your server about any dietary restrictions, and our chefs will accommodate your needs."
    },
    {
      id: 6,
      question: "What are your COVID-19 safety protocols?",
      answer: "We maintain strict hygiene and safety protocols including regular sanitization, temperature checks, socially distanced seating, and fully vaccinated staff."
    }
  ]
};

// Update the default export to include both your original content and the new OrderManagementSystem
export default function Home() {
  // Original Home component code remains here...
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const categories = ['All', ...new Set(restaurantData.foods.map(food => food.category))];
  
  const filteredFoods = activeCategory === 'All' 
    ? restaurantData.foods 
    : restaurantData.foods.filter(food => food.category === activeCategory);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">Bangalore Spice</h1>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                <MenuIcon />
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-orange-600">Home</a>
              <a href="#menu" className="text-gray-700 hover:text-orange-600">Menu</a>
              <a href="#chefs" className="text-gray-700 hover:text-orange-600">Our Chefs</a>
              <a href="#reviews" className="text-gray-700 hover:text-orange-600">Reviews</a>
              <a href="#faq" className="text-gray-700 hover:text-orange-600">FAQ</a>
              <a href="#about" className="text-gray-700 hover:text-orange-600">About</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600">Contact</a>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                Reserve Table
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-orange-600">Home</a>
                <a href="#menu" className="block px-3 py-2 text-gray-700 hover:text-orange-600">Menu</a>
                <a href="#chefs" className="block px-3 py-2 text-gray-700 hover:text-orange-600">Our Chefs</a>
                <a href="#reviews" className="block px-3 py-2 text-gray-700 hover:text-orange-600">Reviews</a>
                <a href="#faq" className="block px-3 py-2 text-gray-700 hover:text-orange-600">FAQ</a>
                <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-orange-600">About</a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-orange-600">Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <img 
          src="/images/hero-bg.jpg" 
          alt="Restaurant Ambiance" 
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Bangalore Spice</h1>
            <p className="text-xl md:text-2xl mb-8">Experience authentic Indian cuisine</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-orange-700">
                View Menu
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg hover:bg-white hover:text-orange-600 transition-colors">
                Reserve Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <section id="menu" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
            
          
          {/* Category Tabs */}
          
          
          {/* Menu Items */}
          <OrderManagementSystem /> 
        </div>
      </section>


      {/* Special Offers */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {restaurantData.specialOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-600">
                <div className="flex items-start">
                  <Gift className="w-8 h-8 text-orange-600 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-orange-600 mb-2">{offer.title}</h3>
                    <p className="text-gray-700">{offer.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section id="reviews" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {restaurantData.reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">{review.name}</h4>
                    <p className="text-gray-500 text-sm">{review.date}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="border-2 border-orange-600 text-orange-600 px-6 py-2 rounded-lg hover:bg-orange-600 hover:text-white transition-colors">
              View All Reviews
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {restaurantData.faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-orange-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-orange-600" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-gray-700">
              Still have questions? <a href="#contact" className="text-orange-600 font-medium">Contact us</a>
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2010, Bangalore Spice was born from a passion to bring authentic Indian flavors to the heart of Indiranagar. What started as a small family-run eatery has now grown into one of Bangalore's most beloved dining destinations.
              </p>
              <p className="text-gray-700 mb-4">
                Our recipes have been passed down through generations, preserving the traditional techniques while incorporating modern culinary innovations. We source our ingredients locally whenever possible, supporting community farmers and ensuring the freshest flavors.
              </p>
              <p className="text-gray-700">
                At Bangalore Spice, we believe that food is not just about taste—it's about creating memorable experiences. Every dish tells a story of India's rich culinary heritage, and we're proud to share these stories with you.
              </p>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Our Values</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                    <span>Authentic flavors without compromise</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                    <span>Sustainable, locally-sourced ingredients</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                    <span>Warm, attentive service</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                    <span>Community engagement and support</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/images/restaurant-1.jpg" 
                alt="Restaurant Interior" 
                className="rounded-lg shadow-md"
              />
              <img 
                src="/images/restaurant-2.jpg" 
                alt="Restaurant Patio" 
                className="rounded-lg shadow-md mt-6"
              />
              <img 
                src="/images/restaurant-3.jpg" 
                alt="Restaurant Bar" 
                className="rounded-lg shadow-md"
              />
              <img 
                src="/images/restaurant-4.jpg" 
                alt="Chef Preparing Food" 
                className="rounded-lg shadow-md mt-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Visit Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-orange-600 mr-2" />
                  <p>123 Indiranagar, Bangalore - 560038</p>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-orange-600 mr-2" />
                  <p>+91 98765 43210</p>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-orange-600 mr-2" />
                  <p>Open daily: 12 PM - 11 PM</p>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Subject" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                  <textarea 
                    rows="4" 
                    placeholder="Your Message" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                  ></textarea>
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                    Send Message
                  </button>
                </form>
              </div>
              <div className="mt-6 flex space-x-4">
                <Instagram className="w-6 h-6 text-gray-600 hover:text-orange-600 cursor-pointer" />
                <Facebook className="w-6 h-6 text-gray-600 hover:text-orange-600 cursor-pointer" />
                <Twitter className="w-6 h-6 text-gray-600 hover:text-orange-600 cursor-pointer" />
              </div>
            </div>
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5999772776656!2d77.6345!3d12.9715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzI3LjQiTiA3N8KwMzgnMDQuMiJF!5e0!3m2!1sen!2sin!4v1645500000000!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Bangalore Spice</h3>
              <p className="text-gray-400">Authentic Indian Cuisine</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#menu" className="text-gray-400 hover:text-white">Menu</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Reservations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Private Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 rounded-l-lg w-full text-black"
                />
                <button className="bg-orange-600 px-4 py-2 rounded-r-lg hover:bg-orange-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ChatbotWidget />
    </div>
  );
}