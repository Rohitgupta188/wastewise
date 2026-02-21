import { IDonation } from "@/models/Donation";
import { IRequest } from "@/models/Request";

export function scoreRequest(
  donation: IDonation,
  request: IRequest
): number {
  let score = 0;

  
  if ((donation as any).area === (request as any).area) {
    score += 30;
  }

  
  if (request.quantityRequested <= donation.quantity * 0.5) {
    score += 20;
  }

  
  score += 20;

  
  score += 30;

  return score;
}
