import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Checkout from './Checkout';
import * as AuthContext from '../context/AuthContext';
import * as CartContext from '../context/CartContext';
import * as dataService from '../services/dataService';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../context/CartContext', () => ({ useCart: vi.fn() }));
vi.mock('../services/dataService', () => ({ crearPedidoAPI: vi.fn() }));

const renderCheckout = () => {
    return render(<BrowserRouter><Checkout /></BrowserRouter>);
};

const fullCartMock = {
    cart: [{ id: 1, nombre: 'Prod Test', precio: 100, quantity: 1 }],
    cartTotal: 100,
    cartSubtotal: 100,
    discount: 0,
    couponName: '',
    applyCoupon: vi.fn(),
    clearCart: vi.fn()
};

describe('Pruebas en Checkout.jsx', () => {
    
    it('4. Debe bloquear acceso si el usuario no está logueado', () => {
        AuthContext.useAuth.mockReturnValue({ user: null });
        CartContext.useCart.mockReturnValue(fullCartMock);
        
        renderCheckout();
        expect(screen.getByText(/Inicia sesión/i)).toBeInTheDocument();
    });

    it('5. Debe bloquear si el carrito está vacío', () => {
        AuthContext.useAuth.mockReturnValue({ user: { id: 1, nombre: 'User' } });
        CartContext.useCart.mockReturnValue({ ...fullCartMock, cart: [], cartTotal: 0 });
        
        renderCheckout();
        expect(screen.getByText(/Carrito vacío/i)).toBeInTheDocument();
    });

    it('6. Debe mostrar formulario de dirección si el usuario no tiene una', () => {
        const userSinDireccion = { 
            id: 1, 
            nombre: 'Test', 
            calle: '', 
            numero: '', 
            comuna: '' 
        };
        
        AuthContext.useAuth.mockReturnValue({ 
            user: userSinDireccion, 
            updateUser: vi.fn() 
        });
        CartContext.useCart.mockReturnValue(fullCartMock);

        renderCheckout();
        
        expect(screen.getByText(/Falta tu Dirección/i)).toBeInTheDocument();
    });

    it('7. Debe mostrar el Resumen de Pago si el usuario tiene dirección completa', () => {
        const userConDireccion = { 
            id: 1, 
            nombre: 'Test', 
            calle: 'Av Siempre Viva', 
            numero: '123', 
            comuna: 'Springfield' 
        };

        AuthContext.useAuth.mockReturnValue({ user: userConDireccion });
        CartContext.useCart.mockReturnValue(fullCartMock);

        renderCheckout();
        
        expect(screen.getByText(/Finalizar Compra/i)).toBeInTheDocument();
        expect(screen.getByText(/Pagar Ahora/i)).toBeInTheDocument();
    });

    it('9. Botón "Pagar Ahora" llama a la API de pedidos', async () => {
        const userReady = { id: 99, calle: 'Calle', numero: '1', comuna: 'Stgo' };
        
        AuthContext.useAuth.mockReturnValue({ user: userReady });
        CartContext.useCart.mockReturnValue(fullCartMock);
        dataService.crearPedidoAPI.mockResolvedValue({ id: 500 });

        renderCheckout();
        
        const btnPagar = screen.getByText(/Pagar Ahora/i);
        fireEvent.click(btnPagar);

        await waitFor(() => {
            expect(dataService.crearPedidoAPI).toHaveBeenCalled();
        });
    });
});