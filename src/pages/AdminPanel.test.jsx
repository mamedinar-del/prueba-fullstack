import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import * as AuthContext from '../context/AuthContext';
import * as dataService from '../services/dataService';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../services/dataService', () => ({
    getProductos: vi.fn().mockResolvedValue([{ id: 1, nombre: 'Prod Test', precio: 100 }]),
    getUsuariosAPI: vi.fn().mockResolvedValue([]),
    getVentasAPI: vi.fn().mockResolvedValue([]),
    getDashboardData: vi.fn().mockResolvedValue({ totalVentas: 10, totalProductos: 5 }),
    crearProductoAPI: vi.fn(),
    actualizarProductoAPI: vi.fn(),
    eliminarProductoAPI: vi.fn()
}));

describe('Pruebas en AdminPanel.jsx', () => {

    it('10. Redirige al Home si el usuario NO es ADMIN', () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { role: 'CLIENTE' } });
        render(<BrowserRouter><AdminPanel /></BrowserRouter>);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('11. Renderiza el Dashboard si es ADMIN', async () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { role: 'ADMIN' } });
        render(<BrowserRouter><AdminPanel /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText(/Resumen General/i)).toBeInTheDocument();
        });
    });

    it('12. Cambiar de pestaña a "Productos" muestra la tabla', async () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { role: 'ADMIN' } });
        render(<BrowserRouter><AdminPanel /></BrowserRouter>);

        const nav = screen.getByRole('navigation');
        const btnProductos = within(nav).getByText('Productos');
        fireEvent.click(btnProductos);

        await waitFor(() => {
            expect(screen.getByText(/Inventario/i)).toBeInTheDocument();
        });
    });

    it('13. Enviar formulario de crear producto llama a la API', async () => {
        vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: { role: 'ADMIN' } });
        render(<BrowserRouter><AdminPanel /></BrowserRouter>);

        const nav = screen.getByRole('navigation');
        fireEvent.click(within(nav).getByText('Productos'));

        fireEvent.change(screen.getByPlaceholderText(/Nombre/i), { target: { value: 'Juego Nuevo' } });
        fireEvent.change(screen.getByPlaceholderText(/Precio/i), { target: { value: '5000' } });
        fireEvent.change(screen.getByPlaceholderText(/Stock/i), { target: { value: '10' } });
        
        const selectCat = screen.getByRole('combobox');
        fireEvent.change(selectCat, { target: { value: 'Consolas' } });
        
        const btnCrear = screen.getByRole('button', { name: /Crear/i });
        fireEvent.submit(btnCrear.closest('form'));

        await waitFor(() => {
            expect(dataService.crearProductoAPI).toHaveBeenCalled();
        });
    });
});