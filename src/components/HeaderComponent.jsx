import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

function HeaderComponent (){
    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#">Inventory Apps</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Product</Nav.Link>
                        <Nav.Link href="/prices">Prices</Nav.Link>
                        <Nav.Link href="/prices-details">Price</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default HeaderComponent;