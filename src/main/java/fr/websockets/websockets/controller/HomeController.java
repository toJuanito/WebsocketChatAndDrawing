package fr.websockets.websockets.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

	@RequestMapping(value = { "/", "/salle/*" })
	public String index() {
		return "index";
	}

}