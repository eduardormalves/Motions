import './index.css';
import { Composition } from 'remotion';
import { AvoVideo } from './AvoVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AvoExplainer"
      component={AvoVideo}
      durationInFrames={11512}
      fps={120}
      width={1080}
      height={1920}
    />
  );
};
