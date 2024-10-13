import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    useMediaQuery,
    useTheme,
    Box,
    Button,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

function Navbar() {
    const { user, logout } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    useEffect(() => {
        if (user) {
            setIsAdmin(user.role === "Admin");
        }
    }, [user]);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = () => {
        logout();
        setDrawerOpen(false);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard', admin: true },
        { text: 'Bins', icon: <ListAltIcon />, link: '/users/bins', admin: true },
    ];

    const filteredMenuItems = isAdmin ? menuItems : menuItems.filter(item => !item.admin);

    const drawer = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleDrawerToggle}
            onKeyDown={handleDrawerToggle}
        >
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h6">EWMS</Typography>
                {user && (
                    <Typography variant="body2">{`${user.role}: ${user.firstName}`}</Typography>
                )}
            </Box>
            <Divider />
            <List>
                {filteredMenuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        component={Link}
                        to={item.link}
                        selected={location.pathname === item.link}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        EWMS Eco-Smart Waste Management System with Automation PKC
                    </Typography>
                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {filteredMenuItems.map((item) => (
                                <Button
                                    key={item.text}
                                    color="inherit"
                                    component={Link}
                                    to={item.link}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        ml: 1,
                                        bgcolor: location.pathname === item.link ? 'primary.dark' : 'transparent',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                    }}
                                >
                                    <Box display="flex" alignItems="center">
                                        {item.icon}
                                        <Typography sx={{ ml: 1 }}>{item.text}</Typography>
                                    </Box>
                                </Button>
                            ))}
                            <Button
                                color="inherit"
                                onClick={handleLogout}
                                sx={{ ml: 1, display: 'flex', alignItems: 'center' }}
                            >
                                <LogoutIcon />
                                <Typography sx={{ ml: 1 }}>Logout</Typography>
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}

export default Navbar;