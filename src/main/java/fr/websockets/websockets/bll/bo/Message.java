package fr.websockets.websockets.bll.bo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
	private String from;
	private String text;
	private String dataUrl;
}