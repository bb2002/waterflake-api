import { Protocol } from '../../../common/enums/Protocol';

export default interface LocalServerPolicy {
  port: number;
  protocol: Protocol;
}
