"use client"

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, CreditCard, User, Home, Phone } from 'lucide-react';

const OrderManagementSystem = () => {
  // State for cart items
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [orderTotal, setOrderTotal] = useState(0);

  // Menu items from restaurant data
  const menuItems = [
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
      image: "https://healthyfitnessmeals.com/wp-content/uploads/2020/11/Tandoori-chicken-6.jpg",
      category: "Starters"
    },
    {
      id: 6,
      name: "Palak Paneer",
      description: "Cottage cheese cubes in a creamy spinach gravy",
      price: 379,
      image: "https://s3.amazonaws.com/images.chefinyou.com/main/opos-palak-paneer-recipe/main-img4.JPG",
      category: "Main Course"
    },
  ];

  // Calculate total whenever cart changes
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setOrderTotal(total);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    // Show cart briefly when item added
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle user info change
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  // Handle order submission
  const handlePlaceOrder = () => {
    // Normally this would send the order to a backend API
    // For this example, we'll just show a payment link
    alert(`Your order has been placed! Total: ₹${orderTotal}. You'll be redirected to payment.`);
    
    // In a real system, you would redirect to a payment gateway
    // window.location.href = "https://paymentlink.com";
    
    // Reset cart and checkout form
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="relative">
      {/* Menu Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Order Menu</h2>
          
          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-orange-600 text-white px-3 py-1 text-sm rounded-bl-lg">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 min-h-[60px]">{item.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-orange-600 font-bold">₹{item.price}</p>
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" /> Add to Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Button */}
      <button 
        className="fixed bottom-6 left-6 z-40 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 flex items-center justify-center"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 bg-orange-600 text-white flex justify-between items-center">
            <h3 className="text-xl font-bold">Your Order</h3>
            <button onClick={() => setIsCartOpen(false)} className="p-1">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <div className="ml-4">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-gray-600">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="text-orange-600 font-bold">₹{orderTotal}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-orange-700"
              >
                <CreditCard className="w-5 h-5 mr-2" /> Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Complete Your Order</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={userInfo.name}
                      onChange={handleUserInfoChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Delivery Address</label>
                  <div className="relative">
                    <Home className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="address"
                      required
                      value={userInfo.address}
                      onChange={handleUserInfoChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="Complete Address"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={userInfo.phone}
                      onChange={handleUserInfoChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="Contact Number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={userInfo.email}
                    onChange={handleUserInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Email Address"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Special Instructions (Optional)</label>
                  <textarea
                    name="notes"
                    value={userInfo.notes}
                    onChange={handleUserInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Any special requests or delivery instructions"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h4 className="font-medium mb-2">Order Summary</h4>
                <div className="space-y-2 mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity} x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">₹{orderTotal}</span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 flex items-center justify-center"
                >
                  <CreditCard className="w-5 h-5 mr-2" /> Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementSystem;   