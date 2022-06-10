package fr.websockets.websockets.bll.bo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OutputMessage extends Message {
	private String time;

	public OutputMessage(String from, String text, String time, String dataUrl) {
		super(from, text, dataUrl);
		this.time = time;
	}
}