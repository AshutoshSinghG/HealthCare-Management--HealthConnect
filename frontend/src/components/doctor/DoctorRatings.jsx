import { motion } from 'framer-motion';
import { Star, Loader2, MessageSquare, AlertTriangle, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StarRating from '../../components/ui/StarRating';
import { useDoctorRatings, useDoctorAverageRating } from '../../hooks/useRatings';
import { useDoctorDashboard } from '../../hooks/useDoctors';
import { formatDate } from '../../utils/formatDate';

const DoctorRatings = () => {
  const { data: dashboardData, isLoading: isDashboardLoading } = useDoctorDashboard();
  const doctorId = dashboardData?.profile?._id;

  const { data: averageData, isLoading: isAverageLoading } = useDoctorAverageRating(doctorId);
  const { data: ratings = [], isLoading: isRatingsLoading, error } = useDoctorRatings(doctorId);

  const isLoading = isDashboardLoading || isAverageLoading || isRatingsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading ratings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-warning-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-surface-800">Unable to load ratings</h3>
          <p className="text-surface-500 text-sm mt-1">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { averageRating = 0, totalReviews = 0 } = averageData || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Patient Ratings</h1>
        <p className="text-sm text-surface-500">View feedback and ratings from your patients.</p>
      </div>

      {/* Summary Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="text-center sm:text-left">
              <h2 className="text-5xl font-bold text-white mb-2">{averageRating.toFixed(1)}</h2>
              <div className="flex justify-center sm:justify-start mb-2">
                <StarRating rating={Math.round(averageRating)} readonly size="md" className="text-warning-400 fill-warning-400" />
              </div>
              <p className="text-primary-100 text-sm">Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
            </div>
            
            <div className="hidden sm:block w-px h-24 bg-primary-500/50"></div>
            
            <div className="flex-1 w-full space-y-2">
               {/* Star breakdown could go here if implemented in backend, for now show a generic nice message */}
               <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                 <h3 className="font-medium flex items-center gap-2 mb-1">
                   <MessageSquare className="w-4 h-4 text-primary-200" />
                   Patient Feedback
                 </h3>
                 <p className="text-sm text-primary-100 leading-relaxed">
                   Ratings are submitted anonymously by patients after completing their appointments. High ratings help improve your visibility to new patients.
                 </p>
               </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Ratings List */}
      <div>
        <h3 className="section-title mb-4">Recent Reviews</h3>
        
        {ratings.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Star className="w-12 h-12 text-surface-200 mb-3" />
              <h3 className="text-surface-800 font-medium">No ratings yet</h3>
              <p className="text-sm text-surface-500 mt-1">
                When patients rate their appointments, their feedback will appear here.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratings.map((rating, idx) => (
              <motion.div 
                key={rating.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.05 }}
              >
                <Card hover className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {rating.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-surface-800 text-sm">{rating.patientName}</p>
                        <p className="text-xs text-surface-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(rating.date)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning" className="bg-warning-50 text-warning-700 border-warning-200">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold">{rating.rating}.0</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="flex-1 mt-2">
                    {rating.review ? (
                      <p className="text-sm text-surface-600 italic bg-surface-50 p-3 rounded-xl border border-surface-100">
                        "{rating.review}"
                      </p>
                    ) : (
                      <p className="text-sm text-surface-400 italic">No written review provided.</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRatings;
